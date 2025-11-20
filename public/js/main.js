// 전역 변수
let freelancersData = [];

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadFreelancers();
    setupEventListeners();
});

// 프리랜서 데이터 로드
async function loadFreelancers() {
    try {
        const response = await fetch('/api/freelancers');
        freelancersData = await response.json();
        displayFreelancers(freelancersData);
    } catch (error) {
        console.error('프리랜서 데이터 로드 실패:', error);
        document.getElementById('freelancerGrid').innerHTML = 
            '<p style="text-align: center; color: #999;">데이터를 불러올 수 없습니다.</p>';
    }
}

// 프리랜서 카드 표시
function displayFreelancers(freelancers) {
    const grid = document.getElementById('freelancerGrid');
    
    if (freelancers.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999;">검색 결과가 없습니다.</p>';
        return;
    }
    
    grid.innerHTML = freelancers.map(freelancer => `
        <div class="freelancer-card" onclick="viewProfile(${freelancer.id})">
            <div class="freelancer-header">
                <img src="${freelancer.portfolio[0].thumbnail}" 
                     alt="${freelancer.name}" 
                     class="portfolio-preview"
                     onerror="this.src='https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'">
            </div>
            <div class="freelancer-body">
                <div class="freelancer-title">
                    <div class="freelancer-name">
                        <h3>${freelancer.name}</h3>
                        <p>${freelancer.title}</p>
                    </div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        ${freelancer.rating}
                    </div>
                </div>
                
                <div class="song-types">
                    ${freelancer.songTypes.map(type => 
                        `<span class="song-type-badge">
                            <i class="fas fa-music"></i> ${type}
                        </span>`
                    ).join('')}
                </div>
                
                <div class="freelancer-stats">
                    <div class="stat">
                        <span class="stat-value">${freelancer.orders}</span>
                        <span class="stat-label">완료</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${freelancer.reviews}</span>
                        <span class="stat-label">리뷰</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${freelancer.responseTime}</span>
                        <span class="stat-label">응답시간</span>
                    </div>
                </div>
                
                <div class="price">${freelancer.price}</div>
                
                <a href="/freelancer/${freelancer.id}" class="btn-view-profile" onclick="event.stopPropagation();">
                    프로필 보기
                </a>
            </div>
        </div>
    `).join('');
}

// 프로필 페이지로 이동
function viewProfile(id) {
    window.location.href = `/freelancer/${id}`;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 기능
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.btn-search');
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // 정렬 기능
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortFreelancers(e.target.value);
        });
    }
    
    // 카테고리 필터
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
        });
    });
}

// 검색 수행
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayFreelancers(freelancersData);
        return;
    }
    
    const filtered = freelancersData.filter(freelancer => {
        return freelancer.name.toLowerCase().includes(searchTerm) ||
               freelancer.title.toLowerCase().includes(searchTerm) ||
               freelancer.specialty.toLowerCase().includes(searchTerm) ||
               freelancer.description.toLowerCase().includes(searchTerm) ||
               freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm));
    });
    
    displayFreelancers(filtered);
    
    // 검색 결과로 스크롤
    document.querySelector('.freelancers').scrollIntoView({ behavior: 'smooth' });
}

// 프리랜서 정렬
function sortFreelancers(sortBy) {
    let sorted = [...freelancersData];
    
    switch(sortBy) {
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'orders':
            sorted.sort((a, b) => b.orders - a.orders);
            break;
        case 'reviews':
            sorted.sort((a, b) => b.reviews - a.reviews);
            break;
    }
    
    displayFreelancers(sorted);
}

// 카테고리로 필터링 (송 타입 기준)
function filterByCategory(category) {
    const filtered = freelancersData.filter(freelancer => {
        // songTypes 배열이 있으면 그것을 우선 사용
        if (freelancer.songTypes && Array.isArray(freelancer.songTypes)) {
            return freelancer.songTypes.some(type => type.includes(category) || category.includes(type));
        }
        // 없으면 specialty 사용
        return freelancer.specialty && freelancer.specialty.includes(category);
    });
    
    displayFreelancers(filtered);
    
    // 프리랜서 섹션으로 스크롤
    document.querySelector('.freelancers').scrollIntoView({ behavior: 'smooth' });
}

// 타겟 고객별 필터링
function filterByTarget(targetType) {
    const filtered = freelancersData.filter(freelancer => 
        freelancer.targetClients && freelancer.targetClients.includes(targetType)
    );
    
    displayFreelancers(filtered);
    
    // 프리랜서 섹션으로 스크롤
    document.querySelector('.freelancers').scrollIntoView({ behavior: 'smooth' });
}

// 부드러운 스크롤 (네비게이션 링크)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
