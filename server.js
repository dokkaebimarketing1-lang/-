const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 프리랜서 상세 페이지
app.get('/freelancer/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'freelancer.html'));
});

// 주문 페이지
app.get('/order/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

// 대시보드 페이지
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API: 프리랜서 목록
app.get('/api/freelancers', (req, res) => {
  res.json(require('./data/freelancers.json'));
});

// API: 특정 프리랜서 정보
app.get('/api/freelancers/:id', (req, res) => {
  const freelancers = require('./data/freelancers.json');
  const freelancer = freelancers.find(f => f.id === parseInt(req.params.id));
  
  if (freelancer) {
    res.json(freelancer);
  } else {
    res.status(404).json({ error: '프리랜서를 찾을 수 없습니다.' });
  }
});

// API: 주문 접수
app.post('/api/order', (req, res) => {
  console.log('주문 접수:', req.body);
  res.json({ 
    success: true, 
    message: '주문이 성공적으로 접수되었습니다. 프리랜서가 곧 연락드릴 예정입니다.',
    orderId: Date.now()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI 뮤직비디오 마켓플레이스가 http://0.0.0.0:${PORT} 에서 실행 중입니다.`);
});
