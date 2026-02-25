const {Firestore} = require('@google-cloud/firestore');
const path = require('path');

const db = new Firestore({
  projectId: 'simple-sales-notificatio-4b263',
  keyFilename: path.join(__dirname, 'serviceAccount.development.json') // Đường dẫn tới file vừa tải
});

// ...

const SHOP_DOMAIN = 'avada-training-demo.myshopify.com'; // Thay bằng shop của bạn
const DAYS_TO_GENERATE = 100;

async function seedStatistics() {
  console.log(`🚀 Starting to seed data for ${SHOP_DOMAIN}...`);

  const batch = db.batch();
  const dailyCollection = db
    .collection('statistics')
    .doc(SHOP_DOMAIN)
    .collection('daily');

  for (let i = 0; i < DAYS_TO_GENERATE; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

    // Tạo dữ liệu giả ngẫu nhiên
    // Impressions từ 100 - 500
    const impressions = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
    // Clicks từ 5 - 50 (đảm bảo clicks luôn nhỏ hơn impressions)
    const clicks = Math.floor(Math.random() * (50 - 5 + 1)) + 5;

    const docRef = dailyCollection.doc(dateString);

    batch.set(
      docRef,
      {
        date: dateString,
        impressions: impressions,
        clicks: clicks,
        lastUpdateAt: new Date()
      },
      {merge: true}
    );

    console.log(`- Prepared data for: ${dateString} (I: ${impressions}, C: ${clicks})`);
  }

  try {
    await batch.commit();
    console.log('✅ Success! 30 days of statistics have been seeded.');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedStatistics();
