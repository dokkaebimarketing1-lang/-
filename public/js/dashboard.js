// 대시보드 JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeTabs();
    initializeCharts();
    initializeCopyButton();
});

// 네비게이션 초기화
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 모든 nav-item과 section에서 active 클래스 제거
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // 클릭한 nav-item에 active 추가
            item.classList.add('active');
            
            // 해당 섹션 표시
            const sectionId = item.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // URL 해시 업데이트
            window.location.hash = sectionId;
        });
    });

    // 페이지 로드 시 해시에 따라 섹션 표시
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetNav = document.querySelector(`.nav-item[data-section="${hash}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }
}

// 탭 초기화 (동영상 업로드)
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 모든 탭 버튼과 콘텐츠에서 active 제거
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 클릭한 버튼에 active 추가
            btn.classList.add('active');
            
            // 해당 탭 콘텐츠 표시
            const tabId = btn.getAttribute('data-tab') + '-tab';
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 차트 초기화 (Chart.js 사용)
function initializeCharts() {
    const revenueCanvas = document.getElementById('revenueChart');
    
    if (revenueCanvas) {
        // 실제 프로젝트에서는 Chart.js 라이브러리를 사용
        // 여기서는 간단한 플레이스홀더를 표시
        const ctx = revenueCanvas.getContext('2d');
        
        // 간단한 막대 그래프 그리기 (데모용)
        const data = [3200000, 3800000, 3500000, 4100000, 3900000, 4250000];
        const labels = ['6월', '7월', '8월', '9월', '10월', '11월'];
        const maxValue = Math.max(...data);
        const barWidth = revenueCanvas.width / (data.length * 2);
        const heightScale = (revenueCanvas.height - 40) / maxValue;

        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, 0, revenueCanvas.width, revenueCanvas.height);

        // 막대 그리기
        data.forEach((value, index) => {
            const x = (index * 2 + 0.5) * barWidth;
            const height = value * heightScale;
            const y = revenueCanvas.height - height - 20;

            // 그라디언트 생성
            const gradient = ctx.createLinearGradient(0, y, 0, revenueCanvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, height);

            // 레이블
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth / 2, revenueCanvas.height - 5);
        });
    }
}

// 복사 버튼 초기화
function initializeCopyButton() {
    const copyBtn = document.querySelector('.btn-copy');
    const linkInput = document.querySelector('.link-box input');

    if (copyBtn && linkInput) {
        copyBtn.addEventListener('click', () => {
            linkInput.select();
            document.execCommand('copy');
            
            // 피드백 표시
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = '#d1fae5';
            copyBtn.style.color = '#059669';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        });
    }
}

// 필터 버튼 (수익 관리)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        const parent = e.target.parentElement;
        const filterBtns = parent.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // 여기에 필터링 로직 추가 가능
    }
});

// 학습 센터 카테고리 필터
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // 여기에 카테고리 필터링 로직 추가 가능
    }
});

// 알림 배지 클릭
document.addEventListener('click', (e) => {
    if (e.target.closest('.notifications')) {
        alert('알림 기능은 준비 중입니다!');
    }
});

// 사용자 메뉴 클릭
document.addEventListener('click', (e) => {
    if (e.target.closest('.user-menu')) {
        const menu = e.target.closest('.user-menu');
        // 드롭다운 메뉴 토글 로직 추가 가능
        console.log('사용자 메뉴 클릭됨');
    }
});

// 폼 제출 방지 (데모용)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('설정이 저장되었습니다!');
    });
});

// 동영상 카드 클릭 (편집/삭제)
document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-icon:has(.fa-edit)');
    const deleteBtn = e.target.closest('.btn-icon:has(.fa-trash)');
    
    if (editBtn) {
        e.stopPropagation();
        alert('동영상 편집 기능은 준비 중입니다!');
    }
    
    if (deleteBtn) {
        e.stopPropagation();
        if (confirm('정말 이 동영상을 삭제하시겠습니까?')) {
            alert('동영상이 삭제되었습니다!');
        }
    }
});

// 새 영상 추가 카드 클릭
document.addEventListener('click', (e) => {
    if (e.target.closest('.video-card.add-new')) {
        alert('동영상 업로드 기능은 준비 중입니다!');
    }
});

// 출금 신청 버튼
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-withdraw')) {
        if (confirm('출금을 신청하시겠습니까?')) {
            alert('출금 신청이 완료되었습니다!\n영업일 기준 3-5일 내에 입금됩니다.');
        }
    }
});

// 토글 스위치 애니메이션
document.querySelectorAll('.switch input').forEach(switchInput => {
    switchInput.addEventListener('change', (e) => {
        const status = e.target.checked ? '활성화' : '비활성화';
        console.log(`알림 설정 ${status}`);
    });
});

// 스크롤 애니메이션 (카드가 보이면 페이드인)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            entry.target.style.transition = 'opacity 0.5s, transform 0.5s';
            
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 모든 카드에 애니메이션 적용
document.querySelectorAll('.card, .stat-card, .revenue-card').forEach(card => {
    observer.observe(card);
});

// 실시간 시간 업데이트 (예: "오늘도 좋은 하루 보내세요")
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingText = document.querySelector('.section-subtitle');
    
    if (greetingText && greetingText.textContent.includes('좋은 하루')) {
        let greeting = '좋은 하루';
        
        if (hour < 12) {
            greeting = '좋은 아침';
        } else if (hour < 18) {
            greeting = '좋은 오후';
        } else {
            greeting = '좋은 저녁';
        }
        
        const currentText = greetingText.textContent;
        greetingText.textContent = currentText.replace('좋은 하루', greeting);
    }
}

// 페이지 로드 시 인사말 업데이트
updateGreeting();

// 통계 숫자 카운트업 애니메이션
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        // 숫자 포맷팅
        if (element.textContent.includes('₩')) {
            element.firstChild.textContent = `₩${Math.floor(current).toLocaleString()}`;
        } else if (element.textContent.includes('.')) {
            element.firstChild.textContent = current.toFixed(1);
        } else {
            element.firstChild.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// 통계 카드가 보이면 카운트업 애니메이션 시작
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const valueElement = entry.target.querySelector('.stat-value');
            if (valueElement && !valueElement.dataset.animated) {
                valueElement.dataset.animated = 'true';
                
                const text = valueElement.firstChild.textContent;
                const numericValue = parseFloat(text.replace(/[^\d.]/g, ''));
                
                if (!isNaN(numericValue)) {
                    animateValue(valueElement, 0, numericValue, 1000);
                }
            }
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// 소셜 공유 버튼
document.addEventListener('click', (e) => {
    const socialBtn = e.target.closest('.social-btn');
    if (socialBtn) {
        const platform = socialBtn.classList.contains('facebook') ? '페이스북' :
                        socialBtn.classList.contains('twitter') ? '트위터' :
                        socialBtn.classList.contains('instagram') ? '인스타그램' : '카카오톡';
        
        alert(`${platform} 공유 기능은 준비 중입니다!`);
    }
});

// 학습 카드 클릭
document.addEventListener('click', (e) => {
    const learningCard = e.target.closest('.learning-card');
    if (learningCard) {
        alert('학습 콘텐츠는 준비 중입니다!');
    }
});

// 검색 기능 (미래 확장용)
function searchContent(query) {
    console.log('검색:', query);
    // 여기에 검색 로직 추가
}

// 페이지 가시성 변경 감지
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('대시보드 페이지가 숨겨짐');
    } else {
        console.log('대시보드 페이지가 다시 표시됨');
        // 데이터 갱신 등의 작업 수행 가능
    }
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K로 검색 (미래 기능)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        alert('검색 기능은 준비 중입니다!');
    }
    
    // ESC로 모달 닫기 (미래 기능)
    if (e.key === 'Escape') {
        // 모달 닫기 로직
    }
});

console.log('대시보드 초기화 완료');
