// 启明书光公益中心 - 盲文图书捐赠与登记逻辑 (donation.js)

document.addEventListener('DOMContentLoaded', () => {
    // 获取页面元素
    const toggleOnetime = document.getElementById('toggle-onetime'); // 急需书目
    const toggleMonthly = document.getElementById('toggle-monthly'); // 寄送图书登记
    const presetBtns = document.querySelectorAll('.preset-btn');
    const donationSlider = document.getElementById('donation-slider');
    const customAmountInput = document.getElementById('custom-amount-input');
    const impactMain = document.getElementById('impact-main');
    const impactDetails = document.getElementById('impact-details');
    const btnDonate = document.getElementById('btn-donate-submit');
    
    // 如果页面上没有这些元素，不执行（例如在非加入与合作页面）
    if (!donationSlider || !customAmountInput) return;
    
    let isRegisterMode = true; // 默认是登记寄送模式
    let currentBooks = 10; // 默认 10 本
    
    // 1. 初始化滑动条和输入框范围
    donationSlider.min = 1;
    donationSlider.max = 100;
    donationSlider.step = 1;
    donationSlider.value = currentBooks;
    customAmountInput.min = 1;
    customAmountInput.max = 1000;
    customAmountInput.value = currentBooks;
    
    updateImpactDescription(currentBooks);

    // 2. 模式切换：寄送图书登记 vs 急需书目
    toggleOnetime.addEventListener('click', () => {
        isRegisterMode = false;
        toggleOnetime.classList.add('active');
        toggleMonthly.classList.remove('active');
        updateImpactDescription(currentBooks);
    });

    toggleMonthly.addEventListener('click', () => {
        isRegisterMode = true;
        toggleMonthly.classList.add('active');
        toggleOnetime.classList.remove('active');
        updateImpactDescription(currentBooks);
    });

    // 3. 预设本数按钮点击
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.getAttribute('data-val'));
            
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentBooks = val;
            donationSlider.value = val;
            customAmountInput.value = val;
            updateImpactDescription(val);
        });
    });

    // 4. 滑动条数值变化
    donationSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        currentBooks = val;
        customAmountInput.value = val;
        
        updatePresetButtonsHighlight(val);
        updateImpactDescription(val);
    });

    // 5. 手动输入框数值变化
    customAmountInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val <= 0) {
            val = 1;
        }
        
        if (val > 100) {
            donationSlider.value = 100;
        } else {
            donationSlider.value = val;
        }
        
        currentBooks = val;
        updatePresetButtonsHighlight(val);
        updateImpactDescription(val);
    });

    customAmountInput.addEventListener('blur', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) {
            val = 1;
            customAmountInput.value = 1;
            donationSlider.value = 1;
            currentBooks = 1;
            updateImpactDescription(1);
        }
    });

    // 6. 辅助函数：根据数值高亮预设按钮
    function updatePresetButtonsHighlight(val) {
        presetBtns.forEach(btn => {
            const btnVal = parseInt(btn.getAttribute('data-val'));
            if (btnVal === val) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 7. 辅助函数：计算并更新物资配算描述
    function updateImpactDescription(val) {
        const lang = localStorage.getItem('voicforyou_lang') || 'zh';
        const dict = window.translations[lang];
        
        const modeText = isRegisterMode ? dict["calc-monthly"] : dict["calc-onetime"];
        const bookUnit = lang === 'zh' ? '本' : (lang === 'vi' ? 'cuốn' : 'Books');
        
        impactMain.textContent = `${modeText} : ${val} ${bookUnit}`;
        
        // 当是预设数值时，输出高度对应的描述文案
        if (val === 1) {
            impactDetails.textContent = dict["impact-10"];
        } else if (val === 5) {
            impactDetails.textContent = dict["impact-25"];
        } else if (val === 10) {
            impactDetails.textContent = dict["impact-50"];
        } else if (val === 20) {
            impactDetails.textContent = dict["impact-100"];
        } else {
            // 自定义本数的动态比例算法
            // 假设：1本书直接服务 1名失明孩子
            const kids = val;
            impactDetails.textContent = `${dict["impact-custom-pre"]}${val}${dict["impact-custom-unit-hours"]}${kids}${dict["impact-custom-unit-kids"]}`;
        }
    }

    // 监听语言切换事件，重新加载文案
    document.addEventListener('languageChanged', (e) => {
        updateImpactDescription(currentBooks);
    });

    // 8. 提交动作模拟（弹出寄送地址和流程提示）
    btnDonate.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('voicforyou_lang') || 'zh';
        let alertMsg = "";
        
        const consignee = "启明书光公益中心 接收组 (Trung tâm Từ thiện Ánh Sáng Sách Kính - Bộ phận Tiếp nhận)";
        const phone = "+84 (0) 24-789-0789";
        const address = "越南河内市巴亭郡讲武路200号 (Số 200 Giảng Võ, Ba Đình, Hà Nội, Việt Nam)";
        
        if (lang === 'zh') {
            alertMsg = `🎉 感谢您的课本捐赠登记！\n\n您登记寄送的盲文书籍数量为：${currentBooks} 本。\n\n请将书籍通过快递邮寄至以下地址：\n-------------------------\n收件人：${consignee}\n联系电话：${phone}\n收件地址：${address}\n-------------------------\n\n温馨提示：请在快递单备注栏写上“捐赠课本”，我们在收到并查验入库后，会通过系统及公示榜向您确认。`;
        } else if (lang === 'vi') {
            alertMsg = `🎉 Cảm ơn bạn đã đăng ký quyên góp sách chữ nổi!\n\nSố lượng sách đăng ký gửi: ${currentBooks} cuốn.\n\nVui lòng gửi chuyển phát nhanh sách đến địa chỉ sau:\n-------------------------\nNgười nhận: ${consignee}\nĐiện thoại: ${phone}\nĐịa chỉ nhận: ${address}\n-------------------------\n\nLưu ý: Vui lòng ghi chú "Quyên góp sách chữ nổi" trên phiếu gửi. Khi nhận được và kiểm kho, chúng tôi sẽ cập nhật công khai xác nhận.`;
        } else {
            alertMsg = `🎉 Thank you for registering your textbook donation!\n\nRegistered quantity: ${currentBooks} books.\n\nPlease ship the books via express courier to:\n-------------------------\nConsignee: ${consignee}\nPhone: ${phone}\nAddress: ${address}\n-------------------------\n\nNote: Please write "Braille Book Donation" in the courier notes. Once received and logged, we will issue a confirmation.`;
        }
        
        alert(alertMsg);
        
        // 重置表单或输入框值
        customAmountInput.value = 10;
        donationSlider.value = 10;
        currentBooks = 10;
        updatePresetButtonsHighlight(10);
        updateImpactDescription(10);
    });
});
