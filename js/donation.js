// 启明书光公益中心 - 爱心捐助计算器逻辑 (donation.js)

document.addEventListener('DOMContentLoaded', () => {
    // 获取页面元素
    const toggleOnetime = document.getElementById('toggle-onetime');
    const toggleMonthly = document.getElementById('toggle-monthly');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const donationSlider = document.getElementById('donation-slider');
    const customAmountInput = document.getElementById('custom-amount-input');
    const impactMain = document.getElementById('impact-main');
    const impactDetails = document.getElementById('impact-details');
    const btnDonate = document.getElementById('btn-donate-submit');
    
    // 如果页面上没有这些元素，不执行（例如在非联系/加入页面）
    if (!donationSlider || !customAmountInput) return;
    
    let isMonthly = false;
    let currentAmount = 50; // 默认 50 美元
    
    // 1. 初始化
    donationSlider.value = currentAmount;
    customAmountInput.value = currentAmount;
    updateImpactDescription(currentAmount);

    // 2. 单次/每月定期资助切换
    toggleOnetime.addEventListener('click', () => {
        isMonthly = false;
        toggleOnetime.classList.add('active');
        toggleMonthly.classList.remove('active');
        updateImpactDescription(currentAmount);
    });

    toggleMonthly.addEventListener('click', () => {
        isMonthly = true;
        toggleMonthly.classList.add('active');
        toggleOnetime.classList.remove('active');
        updateImpactDescription(currentAmount);
    });

    // 3. 预设金额按钮点击
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.getAttribute('data-val'));
            
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentAmount = amount;
            donationSlider.value = amount;
            customAmountInput.value = amount;
            updateImpactDescription(amount);
        });
    });

    // 4. 滑动条数值变化
    donationSlider.addEventListener('input', (e) => {
        const amount = parseInt(e.target.value);
        currentAmount = amount;
        customAmountInput.value = amount;
        
        // 匹配预设按钮高亮
        updatePresetButtonsHighlight(amount);
        updateImpactDescription(amount);
    });

    // 5. 手动输入框数值变化
    customAmountInput.addEventListener('input', (e) => {
        let amount = parseInt(e.target.value);
        if (isNaN(amount) || amount <= 0) {
            amount = 1;
        }
        
        // 限制滑动条最大范围为 1000
        if (amount > 1000) {
            donationSlider.value = 1000;
        } else {
            donationSlider.value = amount;
        }
        
        currentAmount = amount;
        updatePresetButtonsHighlight(amount);
        updateImpactDescription(amount);
    });

    // 处理离开焦点时的防呆机制
    customAmountInput.addEventListener('blur', (e) => {
        let amount = parseInt(e.target.value);
        if (isNaN(amount) || amount < 5) {
            amount = 5;
            customAmountInput.value = 5;
            donationSlider.value = 5;
            currentAmount = 5;
            updateImpactDescription(5);
        }
    });

    // 6. 辅助函数：根据数值高亮预设按钮
    function updatePresetButtonsHighlight(amount) {
        presetBtns.forEach(btn => {
            const val = parseInt(btn.getAttribute('data-val'));
            if (val === amount) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 7. 辅助函数：计算并更新物资配算描述
    function updateImpactDescription(amount) {
        const lang = localStorage.getItem('voicforyou_lang') || 'zh';
        const dict = window.translations[lang];
        
        // 当是预设数值时，输出高度对应的描述文案
        if (amount === 10) {
            impactMain.textContent = isMonthly ? `${dict["calc-monthly"]} $10` : `${dict["calc-onetime"]} $10`;
            impactDetails.textContent = dict["impact-10"];
        } else if (amount === 25) {
            impactMain.textContent = isMonthly ? `${dict["calc-monthly"]} $25` : `${dict["calc-onetime"]} $25`;
            impactDetails.textContent = dict["impact-25"];
        } else if (amount === 50) {
            impactMain.textContent = isMonthly ? `${dict["calc-monthly"]} $50` : `${dict["calc-onetime"]} $50`;
            impactDetails.textContent = dict["impact-50"];
        } else if (amount === 100) {
            impactMain.textContent = isMonthly ? `${dict["calc-monthly"]} $100` : `${dict["calc-onetime"]} $100`;
            impactDetails.textContent = dict["impact-100"];
        } else {
            // 自定义金额的动态比例算法
            // 假设：$1 = 2小时录音 / 解答
            // 假设：$50 = 1名孩子全年服务费
            const hours = amount * 2;
            const kids = (amount / 60).toFixed(1);
            
            impactMain.textContent = isMonthly ? `${dict["calc-monthly"]} $${amount}` : `${dict["calc-onetime"]} $${amount}`;
            
            if (amount < 10) {
                if (lang === 'zh') {
                    impactDetails.textContent = "感谢您的爱心！每一分捐助都非常珍贵，将全额汇入启明书光助学服务金。";
                } else if (lang === 'vi') {
                    impactDetails.textContent = "Cảm ơn tấm lòng vàng của bạn! Mọi đóng góp đều trân quý và được sử dụng 100% cho các hoạt động thiện nguyện.";
                } else {
                    impactDetails.textContent = "Thank you for your kindness! Every donation is precious and will be fully allocated to the blind child support services.";
                }
            } else {
                impactDetails.textContent = `${dict["impact-custom-pre"]}${hours}${dict["impact-custom-unit-hours"]}${kids}${dict["impact-custom-unit-kids"]}`;
            }
        }
    }

    // 监听语言切换事件，重刷计算器文案
    document.addEventListener('languageChanged', (e) => {
        updateImpactDescription(currentAmount);
    });

    // 8. 提交动作模拟
    btnDonate.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('voicforyou_lang') || 'zh';
        let alertMsg = "";
        
        if (lang === 'zh') {
            alertMsg = `您选择了资助启明书光中心：\n金额：$${currentAmount} USD (${isMonthly ? '每月定期' : '单次捐赠'})\n\n温馨提示：这是一个演示页面。如果是正式资助，系统将在此处引导您跳转至 PACCOM 认可的官方对公账户或信用卡网关。感谢您的爱心！`;
        } else if (lang === 'vi') {
            alertMsg = `Bạn đã chọn quyên góp cho Ánh Sáng Sách Kính:\nSố tiền: $${currentAmount} USD (${isMonthly ? 'Định kỳ hàng tháng' : 'Ủng hộ một lần'})\n\nLưu ý: Đây là trang demo. Đối với quyên góp chính thức, hệ thống sẽ chuyển hướng bạn đến tài khoản ngân hàng chính thức được PACCOM phê duyệt. Xin trân trọng cảm ơn!`;
        } else {
            alertMsg = `You have selected to support Light of Books Center:\nAmount: $${currentAmount} USD (${isMonthly ? 'Monthly Recurring' : 'One-time Donation'})\n\nNote: This is a demonstration. For actual donation, the system will redirect you to official bank accounts approved by PACCOM. Thank you for your generosity!`;
        }
        
        alert(alertMsg);
    });
});
