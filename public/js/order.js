// 크리에이터 정보
let creator = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadCreatorInfo();
    setupFormValidation();
    setMinDate();
});

// 크리에이터 정보 로드
async function loadCreatorInfo() {
    const urlPath = window.location.pathname;
    const creatorId = urlPath.split('/').pop();
    
    try {
        const response = await fetch(`/api/freelancers/${creatorId}`);
        
        if (!response.ok) {
            throw new Error('크리에이터를 찾을 수 없습니다.');
        }
        
        creator = await response.json();
        displayCreatorInfo(creator);
    } catch (error) {
        console.error('크리에이터 정보 로드 실패:', error);
        alert('크리에이터 정보를 불러올 수 없습니다.');
        window.location.href = '/';
    }
}

// 크리에이터 정보 표시
function displayCreatorInfo(creator) {
    document.getElementById('creatorName').textContent = creator.name;
    document.getElementById('creatorTitle').textContent = creator.title;
    document.getElementById('creatorRating').textContent = creator.rating;
    document.getElementById('creatorSpecialty').textContent = creator.specialty;
    document.getElementById('creatorOrders').textContent = `${creator.orders}건`;
    document.getElementById('creatorResponse').textContent = creator.responseTime;
    document.getElementById('creatorPrice').textContent = creator.price;
    
    // 페이지 제목 업데이트
    document.title = `${creator.name}에게 의뢰하기 | AI 뮤직비디오 마켓`;
}

// 최소 날짜 설정 (오늘 이후)
function setMinDate() {
    const deadlineInput = document.getElementById('deadline');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    deadlineInput.min = `${year}-${month}-${day}`;
}

// 폼 유효성 검사 설정
function setupFormValidation() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        await submitOrder();
    });
    
    // 전화번호 입력 포맷팅
    const phoneInput = document.getElementById('clientPhone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 3 && value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 7) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
        
        e.target.value = value;
    });
}

// 폼 유효성 검사
function validateForm() {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    
    // 필수 필드 체크
    const requiredFields = [
        'clientName', 'clientEmail', 'clientPhone',
        'projectTitle', 'musicGenre', 'videoLength',
        'budget', 'deadline', 'description'
    ];
    
    for (const field of requiredFields) {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            alert('모든 필수 항목을 입력해주세요.');
            document.getElementById(field).focus();
            return false;
        }
    }
    
    // 이메일 형식 체크
    const email = formData.get('clientEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        document.getElementById('clientEmail').focus();
        return false;
    }
    
    // 전화번호 형식 체크
    const phone = formData.get('clientPhone');
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        alert('올바른 전화번호를 입력해주세요. (예: 010-1234-5678)');
        document.getElementById('clientPhone').focus();
        return false;
    }
    
    return true;
}

// 주문 제출
async function submitOrder() {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    
    // 크리에이터 정보 추가
    const orderData = {
        creatorId: creator.id,
        creatorName: creator.name,
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        clientPhone: formData.get('clientPhone'),
        projectTitle: formData.get('projectTitle'),
        musicGenre: formData.get('musicGenre'),
        videoLength: formData.get('videoLength'),
        budget: formData.get('budget'),
        deadline: formData.get('deadline'),
        description: formData.get('description'),
        reference: formData.get('reference'),
        musicFile: formData.get('musicFile'),
        submittedAt: new Date().toISOString()
    };
    
    try {
        // 제출 버튼 비활성화
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
        
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessModal();
            form.reset();
        } else {
            throw new Error(result.message || '주문 제출에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('주문 제출 실패:', error);
        alert('주문 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
        
        // 버튼 복구
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 의뢰하기';
    }
}

// 성공 모달 표시
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 성공 모달 닫기
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // 프리랜서 프로필 페이지로 이동
    if (creator) {
        window.location.href = `/freelancer/${creator.id}`;
    } else {
        window.location.href = '/';
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeSuccessModal();
    }
});
