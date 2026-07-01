
const categoryMap = {
    "Chocolates & Berries": "berry",
    "Choles & Berries": "berry", 
    "Waffles": "waffle",
    "Crepes": "crepe",
    "Croissants": "croissant",
    "Others": "others" 
};


const defaultImages = {
    'berry': 'https://images.unsplash.com/photo-1559598467-7154562c5025?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    'waffle': 'https://images.unsplash.com/photo-1562376552-0d160a2f9fa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    'crepe': 'https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    'croissant': 'https://images.unsplash.com/photo-1549903072-7e6e0d234247?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    'others': 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
};


// function toPersianNum(num) {
//     if (!num) return '';
//     const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
//     return num.toString().replace(/\d/g, x => farsiDigits[x]);
// }
// ۰۰۰


function formatPrice(item) {
    if (item.price) return item.price + ',000 T';
    if (item.sizes) {
        let parts = [];
        if (item.sizes.S) parts.push('S: ' + item.sizes.S + ',000');
        if (item.sizes.M) parts.push('M: ' + item.sizes.M + ',000');
        if (item.sizes.L) parts.push('L: ' + item.sizes.L + ',000');
        
        if (parts.length === 0) return 'ناموجود';
        return parts.join(' | ') + ' T';
    }
    return 'ناموجود';
}


function renderMenu(menuData) {
    menuData.forEach(item => {
        if (!item.active) return; 
        
        const sectionId = categoryMap[item.category];
        const section = document.getElementById(sectionId);
        
        if (section) {
            const imgSrc = item.url ? item.url : defaultImages[sectionId];
            const priceText = formatPrice(item);
            
            const cardHTML = `
                <div class="card">
                    <img src="${imgSrc}" alt="${item.name}" class="card-img">
                    <div class="card-info">
                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-desc">${item.ingredients}</p>
                        <div class="card-price" dir = ltr>${priceText}</div>
                    </div>
                </div>
            `;
            section.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}

// واکشی داده‌ها از فایل JSON
async function loadMenuData() {
    try {
        const response = await fetch('./scripts/menuData.json');
        if (!response.ok) {
            throw new Error(`خطا در شبکه: ${response.status}`);
        }
        const data = await response.json();
        renderMenu(data);
    } catch (error) {
        console.error("بارگذاری منو با خطا مواجه شد:", error);
        document.querySelector('.menu-content').innerHTML = `<p style="text-align:center; color:var(--text-muted); padding-top:20px;">خطا در بارگذاری اطلاعات منو. لطفا پروژه را روی Live Server اجرا کنید.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMenuData();

    // منطق سوییچ کردن تب‌ها
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuSections = document.querySelectorAll('.menu-section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            menuSections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
});