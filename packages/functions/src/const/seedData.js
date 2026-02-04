const admin = require('firebase-admin');
const {faker} = require('@faker-js/faker');
const serviceAccount = require('../../serviceAccount.development.json');

// 1. CẤU HÌNH KẾT NỐI
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// --- CẤU HÌNH SHOP ĐỂ SEED DATA ---
// Lưu ý: Hãy điền đúng Domain Shop Dev của bạn để tí nữa vào App còn test được
const SHOP_DOMAIN = 'avada-training-demo.myshopify.com';
const SHOP_ID = 'gid://shopify/Shop/123456789'; // ID giả lập

async function seedSettings() {
  const settingsRef = db.collection('settings').doc(SHOP_DOMAIN);

  const settingData = {
    // Nhóm hiển thị & thời gian
    position: faker.helpers.arrayElement(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
    hideTimeAgo: faker.datatype.boolean(),
    truncateProductName: faker.datatype.boolean(),
    displayDuration: faker.number.int({min: 3, max: 10}),
    firstDelay: faker.number.int({min: 0, max: 10}),
    popsInterval: faker.number.int({min: 1, max: 5}),
    maxPopsDisplay: faker.number.int({min: 5, max: 20}),

    // Nhóm điều kiện trang
    includedUrls: '',
    excludedUrls: '/cart\n/checkout',
    allowShow: 'all',

    // Nhóm định danh (Theo yêu cầu bảng Settings CÓ shopId)
    shopId: SHOP_ID,

    // (Optional) Mình vẫn giữ timestamp tạo để dễ quản lý
    createdAt: new Date()
  };

  await settingsRef.set(settingData, {merge: true});
  console.log(`✅ Đã tạo Settings cho shop: ${SHOP_DOMAIN}`);
}

// 3. HÀM TẠO NOTIFICATIONS
// Schema (Khớp 100% ảnh): firstName, city, productName, country, productId, timestamp, productImage
async function seedNotifications() {
  const batch = db.batch();
  const notiCollection = db.collection('notifications');

  console.log('⏳ Đang tạo 20 thông báo với múi giờ ngẫu nhiên...');

  for (let i = 0; i < 20; i++) {
    const newDocRef = notiCollection.doc();

    // 1. Tạo ngày ngẫu nhiên
    const rawDate = faker.date.recent({days: 5});

    // 2. Tạo múi giờ ngẫu nhiên từ -11 đến +14
    const offset = faker.number.int({min: -11, max: 14});
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset)
      .toString()
      .padStart(2, '0');
    const timezoneStr = `${sign}${absOffset}00`; // Kết quả dạng +0700, -0500...

    // 3. Định dạng chuỗi ngày tháng (không dùng timeZone cố định)
    const formattedDate = rawDate
      .toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
      .replace(',', '');

    const notiData = {
      firstName: faker.person.firstName(),
      city: faker.location.city(),
      productName: faker.commerce.productName(),
      country: faker.location.country(),
      productId: faker.number.int({min: 100000, max: 999999}),
      // 4. Kết hợp ngày và múi giờ ngẫu nhiên
      timestamp: `${formattedDate} ${timezoneStr}`,
      productImage: `https://placehold.co/100x100?text=Product+${i}`,

      // --- THÊM MỚI 2 TRƯỜNG NÀY ---
      shopifyDomain: SHOP_DOMAIN,
      shopifyId: SHOP_ID
    };

    batch.set(newDocRef, notiData);
  }

  await batch.commit();
  console.log(`✅ Đã xong! Timestamp bây giờ có múi giờ đa dạng (VD: +0200, -0800).`);
}

// 4. CHẠY SCRIPT
async function run() {
  try {
    await seedSettings();
    await seedNotifications();
    console.log('🎉 SEED DATA THÀNH CÔNG!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

run();
