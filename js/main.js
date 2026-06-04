// 启明书光公益中心 - 全局交互脚本 (main.js)

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. 移动端菜单导航 (Mobile Navigation Menu)
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // 切换汉堡包图标
            if (navLinks.classList.contains('active')) {
                menuToggle.innerHTML = '&times;'; // 显示关闭叉号
            } else {
                menuToggle.innerHTML = '&#9776;'; // 显示三道杠
            }
        });
        
        // 点击导航链接后自动收起菜单
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '&#9776;';
            });
        });
    }

    // ==========================================================================
    // 2. 无障碍控制工具 (Accessibility Controls)
    // ==========================================================================
    const btnContrast = document.getElementById('btn-contrast');
    const btnLargeText = document.getElementById('btn-large-text');
    const btnXlText = document.getElementById('btn-xl-text');
    const btnResetText = document.getElementById('btn-reset-text');
    
    // 初始化时从本地存储加载无障碍设置
    if (localStorage.getItem('acc_contrast') === 'true') {
        document.body.classList.add('accessibility-contrast');
        if (btnContrast) btnContrast.classList.add('active');
    }
    
    const savedTextSize = localStorage.getItem('acc_text_size');
    if (savedTextSize === 'large') {
        document.body.classList.add('accessibility-large-text');
        if (btnLargeText) btnLargeText.classList.add('active');
    } else if (savedTextSize === 'xl') {
        document.body.classList.add('accessibility-xl-text');
        if (btnXlText) btnXlText.classList.add('active');
    } else {
        if (btnResetText) btnResetText.classList.add('active');
    }

    // 高对比度切换
    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            const isContrast = document.body.classList.toggle('accessibility-contrast');
            localStorage.setItem('acc_contrast', isContrast);
            btnContrast.classList.toggle('active', isContrast);
        });
    }

    // 辅助函数：清除字号相关样式
    function clearTextClasses() {
        document.body.classList.remove('accessibility-large-text', 'accessibility-xl-text');
        [btnLargeText, btnXlText, btnResetText].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
    }

    // 设为中大字号
    if (btnLargeText) {
        btnLargeText.addEventListener('click', () => {
            clearTextClasses();
            document.body.classList.add('accessibility-large-text');
            btnLargeText.classList.add('active');
            localStorage.setItem('acc_text_size', 'large');
        });
    }

    // 设为超大字号
    if (btnXlText) {
        btnXlText.addEventListener('click', () => {
            clearTextClasses();
            document.body.classList.add('accessibility-xl-text');
            btnXlText.classList.add('active');
            localStorage.setItem('acc_text_size', 'xl');
        });
    }

    // 恢复默认字号
    if (btnResetText) {
        btnResetText.addEventListener('click', () => {
            clearTextClasses();
            btnResetText.classList.add('active');
            localStorage.setItem('acc_text_size', 'default');
        });
    }

    // ==========================================================================
    // 3. 滚动渐入动画 (Scroll Fade-in Animations)
    // ==========================================================================
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    if (fadeSections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // 动画加载完后停止监听该元素
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15, // 元素显示15%时触发
            rootMargin: "0px 0px -50px 0px" // 提前或延迟触发以达到完美视觉衔接
        });
        
        fadeSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ==========================================================================
    // 4. 数字翻页动效 (Count-up Stats Numbers)
    // ==========================================================================
    const statsSection = document.querySelector('.stats-section');
    let hasCounted = false;

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    // 对带有数字属性的统计项执行翻牌器动画
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        statsObserver.observe(statsSection);
    }

    function animateStats() {
        const counters = [
            { id: 'stat-kids', target: 180, suffix: '+' },
            { id: 'stat-q', target: 4200, suffix: '+' },
            { id: 'stat-price', target: 0, suffix: ' VNĐ' }
        ];

        counters.forEach(c => {
            const elem = document.getElementById(c.id);
            if (!elem) return;

            let start = 0;
            const end = c.target;
            const duration = 1500; // 动画时长1.5秒
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 使用 easeOutQuad 缓冲公式使数字增长更平滑
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * end);
                
                if (c.id === 'stat-price') {
                    // 全免费特殊处理
                    elem.textContent = '0' + c.suffix;
                } else {
                    elem.textContent = currentValue.toLocaleString() + c.suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    elem.textContent = end.toLocaleString() + c.suffix;
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // ==========================================================================
    // 5. 加入与合作页面标签页切换 (Contact & Volunteer Tabs Switch)
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                const activePanel = document.getElementById(`panel-${targetTab}`);
                if (activePanel) activePanel.classList.add('active');
            });
        });
    }

    // ==========================================================================
    // 6. 表单提交模拟反馈 (Form Submission Simulation)
    // ==========================================================================
    const formMessage = document.getElementById('form-message');
    const formVolunteer = document.getElementById('form-volunteer');
    
    if (formMessage) {
        formMessage.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('msg-name').value;
            const lang = localStorage.getItem('voicforyou_lang') || 'zh';
            
            let successMsg = "";
            if (lang === 'zh') {
                successMsg = `感谢您的留言，${name}！我们会尽快回复您。`;
            } else if (lang === 'vi') {
                successMsg = `Cảm ơn lời nhắn của bạn, ${name}! Chúng tôi sẽ phản hồi sớm nhất có thể.`;
            } else {
                successMsg = `Thank you for your message, ${name}! We will get back to you shortly.`;
            }
            
            alert(successMsg);
            formMessage.reset();
        });
    }

    if (formVolunteer) {
        formVolunteer.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('v-name').value;
            const lang = localStorage.getItem('voicforyou_lang') || 'zh';
            
            let successMsg = "";
            if (lang === 'zh') {
                successMsg = `申请已提交！非常感谢 ${name} 申请成为志愿者。特教组的同仁将在 3 个工作日内通过邮件与您联系。`;
            } else if (lang === 'vi') {
                successMsg = `Đơn đăng ký đã được gửi! Xin chân thành cảm ơn ${name} đã đăng ký làm tình nguyện viên. Đội ngũ giáo dục đặc biệt sẽ liên hệ với bạn qua email trong vòng 3 ngày làm việc.`;
            } else {
                successMsg = `Application submitted! Thank you so much, ${name}, for applying to volunteer. Our special ed team will contact you via email within 3 business days.`;
            }
            
            alert(successMsg);
            formVolunteer.reset();
        });
    }
});
