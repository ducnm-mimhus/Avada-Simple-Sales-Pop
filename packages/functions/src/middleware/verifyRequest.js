import jwt from 'jsonwebtoken';
import {getShopByShopifyDomain} from '@functions/repositories/shopRepository';

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<*>}
 */
export async function verifyRequest(ctx, next) {
  const authorization = ctx.get('Authorization');

  if (!authorization) {
    return ctx.throw(401, 'Unauthorized: Missing Authorization Header');
  }

  try {
    const token = authorization.replace('Bearer ', '');
    const payload = verifyShopifyToken(token);

    if (!payload?.dest) {
      return ctx.throw(401, 'Unauthorized: Invalid Session Token');
    }

    const shopDomain = payload.dest.replace('https://', '');
    const shopDoc = await getShopByShopifyDomain(shopDomain);

    if (!shopDoc) {
      return ctx.throw(401, `Unauthorized: Shop ${shopDomain} not found`);
    }

    const shopData = {
      shop: shopDomain,
      accessToken: shopDoc.accessToken || shopDoc.accessTokenHash,
      id: shopDoc.id
    };

    if (!shopData.accessToken) {
      return ctx.throw(401, 'Unauthorized: Access Token missing');
    }

    ctx.state.user = {
      ...shopData,
      shopData: shopData
    };

    ctx.state.shopify = {
      ...shopData,
      shopData: shopData
    };

    await next();
  } catch (err) {
    console.error('[Auth] Verification failed:', err.message);
    ctx.status = 401;
    ctx.body = {success: false, error: err.message};
  }
}

/**
 *
 * @param token
 * @returns {null|JwtPayload|string}
 */
function verifyShopifyToken(token) {
  try {
    const secret = process.env.SHOPIFY_SECRET;
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}
