// 현재 프리랜서 데이터
let currentFreelancer = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadFreelancerProfile();
    setupModalListeners();
});

// 프리랜서 프로필 로드
async function loadFreelancerProfile() {
    const urlPath = window.location.pathname;
    const freelancerId = urlPath.split('/').pop();
    
    try {
        const response = await fetch(`/api/freelancers/${freelancerId}`);
        
        if (!response.ok) {
            throw new Error('프리랜서를 찾을 수 없습니다.');
        }
        
        currentFreelancer = await response.json();
        displayFreelancerProfile(currentFreelancer);
    } catch (error) {
        console.error('프로필 로드 실패:', error);
        alert('프리랜서 정보를 불러올 수 없습니다.');
        window.location.href = '/';
    }
}

// 프로필 정보 표시
function displayFreelancerProfile(freelancer) {
    // 기본 정보
    document.getElementById('freelancerName').textContent = freelancer.name;
    document.getElementById('freelancerTitle').textContent = freelancer.title;
    document.getElementById('rating').textContent = freelancer.rating;
    document.getElementById('reviewCount').textContent = `(${freelancer.reviews}개 리뷰)`;
    document.getElementById('orderCount').textContent = `${freelancer.orders}건 완료`;
    document.getElementById('specialty').textContent = freelancer.specialty;
    document.getElementById('description').textContent = freelancer.description;
    
    // 가격 및 서비스 정보
    document.getElementById('price').textContent = freelancer.price;
    document.getElementById('responseTime').textContent = freelancer.responseTime;
    document.getElementById('revisions').textContent = freelancer.revisions;
    
    // ROI 통계 표시
    if (freelancer.avgROI && freelancer.successRate) {
        const roiStatsContainer = document.getElementById('roiStats');
        roiStatsContainer.innerHTML = `
            <div class="roi-stat-card">
                <span class="roi-stat-label">평균 ROI</span>
                <span class="roi-stat-value">${freelancer.avgROI}</span>
            </div>
            <div class="roi-stat-card">
                <span class="roi-stat-label">성공률</span>
                <span class="roi-stat-value">${freelancer.successRate}</span>
            </div>
        `;
    }
    
    // 스킬 표시
    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = freelancer.skills.map(skill => 
        `<span class="skill-tag"><i class="fas fa-check"></i> ${skill}</span>`
    ).join('');
    
    // 포트폴리오 표시
    const portfolioContainer = document.getElementById('portfolio');
    portfolioContainer.innerHTML = freelancer.portfolio.map((item, index) => {
        const clientTypeClass = item.clientType === '상담사' ? 'consultant' : 
                               item.clientType === '개인' ? 'individual' : 'business';
        return `
        <div class="portfolio-item" style="cursor: pointer;">
            <div class="portfolio-thumbnail" onclick="openVideoModal(${index})">
                <img src="${item.thumbnail}" alt="${item.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'">
                <div class="play-overlay">
                    <div class="play-icon">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            </div>
            <div class="portfolio-info">
                <span class="client-type-badge ${clientTypeClass}">
                    ${item.clientType === '상담사' ? '👔 상담사' : 
                      item.clientType === '개인' ? '🎵 개인' : '🏢 기업'}
                </span>
                <h4>${item.title}</h4>
                <p class="portfolio-views">
                    <i class="fas fa-eye"></i> ${item.views} 조회
                </p>
                ${item.results ? `
                <div class="portfolio-results">
                    <h4><i class="fas fa-chart-line"></i> 실제 성과</h4>
                    <div class="result-grid">
                        <div class="result-item">
                            <span class="label">매출 증가</span>
                            <span class="value">${item.results.salesIncrease}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">광고 ROAS</span>
                            <span class="value">${item.results.adPerformance.roas}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">클릭률 (CTR)</span>
                            <span class="value">${item.results.adPerformance.ctr}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">전환수</span>
                            <span class="value">${item.results.adPerformance.conversions}</span>
                        </div>
                    </div>
                    <div class="result-highlight">
                        <i class="fas fa-bullseye"></i>
                        ${item.results.businessImpact}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    }).join('');
    
    // 전화 상담 버튼
    const phoneBtn = document.getElementById('phoneBtn');
    phoneBtn.addEventListener('click', showPhoneNumber);
    
    // 주문하기 버튼
    const orderBtn = document.getElementById('orderBtn');
    orderBtn.href = `/order/${freelancer.id}`;
    
    // 페이지 제목 업데이트
    document.title = `${freelancer.name} - ${freelancer.title} | AI 뮤직비디오 마켓`;
}

// 전화번호 표시
function showPhoneNumber() {
    const phoneDisplay = document.getElementById('phoneNumber');
    const phoneSpan = phoneDisplay.querySelector('span');
    
    if (currentFreelancer && currentFreelancer.phone) {
        phoneSpan.textContent = currentFreelancer.phone;
        phoneDisplay.style.display = 'block';
        
        // 버튼 변경
        const phoneBtn = document.getElementById('phoneBtn');
        phoneBtn.innerHTML = '<i class="fas fa-phone-volume"></i> 전화 걸기';
        phoneBtn.onclick = () => {
            window.location.href = `tel:${currentFreelancer.phone}`;
        };
    }
}

// 비디오 모달 열기
function openVideoModal(index) {
    if (!currentFreelancer) return;
    
    const portfolio = currentFreelancer.portfolio[index];
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalVideoTitle');
    const modalViews = document.getElementById('modalVideoViews');
    
    modalVideo.src = portfolio.video + '?autoplay=1';
    modalTitle.textContent = portfolio.title;
    modalViews.textContent = `조회수 ${portfolio.views}`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 비디오 모달 닫기
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    modal.style.display = 'none';
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
}

// 모달 이벤트 리스너 설정
function setupModalListeners() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.modal-close');
    
    // 닫기 버튼 클릭
    closeBtn.addEventListener('click', closeVideoModal);
    
    // 모달 외부 클릭
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });
}
