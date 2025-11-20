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
    // 프로필 사진
    if (freelancer.profilePhoto) {
        document.getElementById('profilePhoto').src = freelancer.profilePhoto;
        document.getElementById('profilePhoto').alt = freelancer.name;
    }
    
    // 인증 배지
    if (freelancer.verified) {
        document.getElementById('verifiedBadge').style.display = 'block';
    }
    
    // 기본 정보
    document.getElementById('freelancerName').textContent = freelancer.name;
    document.getElementById('freelancerTitle').textContent = freelancer.title;
    document.getElementById('rating').textContent = freelancer.rating;
    document.getElementById('reviewCount').textContent = `(${freelancer.reviews}개 리뷰)`;
    document.getElementById('experience').textContent = `경력 ${freelancer.experience}`;
    document.getElementById('orderCount').textContent = `${freelancer.orders}건 완료`;
    
    // 송 타입 배열 표시
    const songTypesContainer = document.getElementById('specialty');
    if (freelancer.songTypes && freelancer.songTypes.length > 0) {
        songTypesContainer.innerHTML = freelancer.songTypes.map(type => 
            `<span class="song-type-badge-detail"><i class="fas fa-music"></i> ${type}</span>`
        ).join('');
    }
    
    document.getElementById('description').textContent = freelancer.description;
    
    // 인증서 표시
    if (freelancer.certifications && freelancer.certifications.length > 0) {
        const certsContainer = document.getElementById('certifications');
        certsContainer.innerHTML = freelancer.certifications.map(cert => 
            `<span class="cert-badge"><i class="fas fa-certificate"></i> ${cert}</span>`
        ).join('');
    }
    
    // 가격 및 서비스 정보
    document.getElementById('price').textContent = freelancer.price;
    document.getElementById('responseTime').textContent = freelancer.responseTime;
    document.getElementById('revisions').textContent = freelancer.revisions;
    
    // ROI 통계 표시 (쉬운 용어로)
    if (freelancer.avgROI && freelancer.successRate) {
        const roiStatsContainer = document.getElementById('roiStats');
        roiStatsContainer.innerHTML = `
            <div class="roi-stat-card">
                <span class="roi-stat-label">평균 효과</span>
                <span class="roi-stat-value">${freelancer.avgROI}</span>
                <span class="roi-stat-desc">투자 대비 수익</span>
            </div>
            <div class="roi-stat-card">
                <span class="roi-stat-label">만족도</span>
                <span class="roi-stat-value">${freelancer.successRate}</span>
                <span class="roi-stat-desc">고객 성공률</span>
            </div>
        `;
    }
    
    // 스킬 표시
    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = freelancer.skills.map(skill => 
        `<span class="skill-tag"><i class="fas fa-check"></i> ${skill}</span>`
    ).join('');
    
    // 크리에이터 특별 영상 표시
    const specialSongsContainer = document.getElementById('specialSongs');
    if (freelancer.introSong && freelancer.dreamSong) {
        specialSongsContainer.innerHTML = `
            <div class="special-song-card">
                <div class="special-song-type">
                    <i class="fas fa-user-circle"></i>
                    개인소개송
                </div>
                <div class="special-song-thumbnail" onclick="openSpecialVideo('intro')">
                    <img src="${freelancer.introSong.thumbnail}" alt="${freelancer.introSong.title}">
                    <div class="play-overlay">
                        <div class="play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="special-song-info">
                    <h4>${freelancer.introSong.title}</h4>
                    <p>${freelancer.introSong.description}</p>
                </div>
            </div>
            <div class="special-song-card">
                <div class="special-song-type">
                    <i class="fas fa-star"></i>
                    꿈꿈송
                </div>
                <div class="special-song-thumbnail" onclick="openSpecialVideo('dream')">
                    <img src="${freelancer.dreamSong.thumbnail}" alt="${freelancer.dreamSong.title}">
                    <div class="play-overlay">
                        <div class="play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="special-song-info">
                    <h4>${freelancer.dreamSong.title}</h4>
                    <p>${freelancer.dreamSong.description}</p>
                </div>
            </div>
        `;
    }
    
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
                    <h4><i class="fas fa-trophy"></i> 실제 효과</h4>
                    <div class="result-simple">
                        <div class="result-main">
                            <span class="result-label">${item.results.simple.mainMetric}</span>
                            <span class="result-big">${item.results.simple.mainValue}</span>
                        </div>
                        <p class="result-desc">${item.results.simple.description}</p>
                    </div>
                    <button class="btn-detail-toggle" onclick="toggleDetails(event, ${index})">
                        <i class="fas fa-chevron-down"></i> 자세히 보기
                    </button>
                    <div class="result-detailed" id="detail-${index}" style="display: none;">
                        <h5>📊 상세 성과</h5>
                        ${Object.entries(item.results.detailed).map(([key, value]) => `
                            <div class="detail-row">
                                <span class="detail-label">${formatLabel(key)}</span>
                                <span class="detail-value">${value}</span>
                            </div>
                        `).join('')}
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

// 특별 영상 모달 열기
function openSpecialVideo(type) {
    if (!currentFreelancer) return;
    
    const song = type === 'intro' ? currentFreelancer.introSong : currentFreelancer.dreamSong;
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalVideoTitle');
    const modalViews = document.getElementById('modalVideoViews');
    
    modalVideo.src = song.video + '?autoplay=1';
    modalTitle.textContent = song.title;
    modalViews.textContent = type === 'intro' ? '개인소개송' : '꿈꿈송';
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
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

// 라벨 한글화
function formatLabel(key) {
    const labels = {
        'views': '조회수',
        'shares': '공유 횟수',
        'clicks': '클릭 수',
        'conversions': '전환/예약',
        'cost': '광고 효율',
        'subscribers': '구독자',
        'fanclub': '팬 수',
        'sales': '매출',
        'brandRecall': '브랜드 인지도',
        'storeVisits': '매장 방문',
        'inquiries': '문의 수',
        'investment': '투자 유치',
        'hiring': '채용 효과',
        'bookings': '예약/공연',
        'followers': '팔로워',
        'income': '수입 증가',
        'repeat': '재생 횟수',
        'satisfaction': '만족도',
        'memories': '추억 보관',
        'engagement': '참여도',
        'morale': '만족도 변화',
        'retention': '직원 만족',
        'compliments': '축하 메시지',
        'memory': '추억 가치',
        'comments': '댓글',
        'impact': '영향력',
        'familyEngagement': '가족 참여',
        'emotionalImpact': '감동 효과',
        'legacy': '유산 가치',
        'brandValue': '브랜드 가치',
        'customerLoyalty': '충성 고객',
        'partnerships': '제휴 문의',
        'revenue': '매출',
        'trust': '신뢰도',
        'enrollment': '수강생'
    };
    return labels[key] || key;
}

// 자세히 보기 토글
function toggleDetails(event, index) {
    event.stopPropagation();
    const detailDiv = document.getElementById(`detail-${index}`);
    const btn = event.currentTarget;
    
    if (detailDiv.style.display === 'none') {
        detailDiv.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> 간단히 보기';
    } else {
        detailDiv.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> 자세히 보기';
    }
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
