// ===================================================================
//                 QUẢN LÝ TÀI KHOẢN LINEAGE2M - v3.0
//                 Hỗ trợ Lịch sử Hoạt động
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- KHAI BÁO BIẾN TOÀN CỤC ---
    const accountsContainer = document.getElementById('accounts-container');
    const addAccountBtn = document.getElementById('add-account-btn');
    const totalAccountsEl = document.getElementById('total-accounts');
    const logoutCountEl = document.getElementById('logout-count');
    const interactCountEl = document.getElementById('interact-count');
    
    let accounts = [];

    // --- CÁC HÀM QUẢN LÝ DỮ LIỆU ---

    function loadAccounts() {
        const savedAccounts = localStorage.getItem('lineage2m_accounts_data_v3'); // Đổi tên key để tránh xung đột với phiên bản cũ
        if (savedAccounts) {
            accounts = JSON.parse(savedAccounts);
        } else {
            accounts = [];
        }
    }

    function saveAccounts() {
        localStorage.setItem('lineage2m_accounts_data_v3', JSON.stringify(accounts));
        updateStats();
        renderAccounts(); // **QUAN TRỌNG**: Sau mỗi lần lưu, vẽ lại toàn bộ giao diện để đảm bảo tính nhất quán.
    }
    
    function updateStats() {
        const logoutCount = accounts.filter(acc => acc.isLoggedOut).length;
        const interactCount = accounts.filter(acc => acc.interacted).length;
        
        totalAccountsEl.textContent = accounts.length;
        logoutCountEl.textContent = logoutCount;
        interactCountEl.textContent = interactCount;
    }

    /**
     * Hàm ghi lại một hoạt động vào lịch sử của tài khoản.
     * Đây là hàm trung tâm của tính năng mới.
     * @param {number} accountId ID của tài khoản
     * @param {string} type Loại hành động (ví dụ: 'CREATE', 'LOGIN', 'RENAME')
     * @param {object} payload Dữ liệu kèm theo (ví dụ: { oldName: 'A', newName: 'B' })
     */
    function logActivity(accountId, type, payload = {}) {
        const account = accounts.find(acc => acc.id === accountId);
        if (account) {
            const logEntry = {
                type: type,
                payload: payload,
                timestamp: new Date().toISOString()
            };
            // Thêm vào đầu mảng để log mới nhất luôn ở trên
            account.history.unshift(logEntry);
        }
    }
    
    // --- CÁC HÀM HÀNH ĐỘNG (THÊM/XÓA/SỬA) ---

    function addNewAccount() {
        const newId = Date.now();
        const newAccount = {
            id: newId,
            name: `Account ${accounts.length + 1}`,
            isLoggedOut: false, // Thay cho `logout`. True = đã đăng xuất.
            interacted: false,
            interactTime: null,
            history: [], // *** CẤU TRÚC MỚI: Mảng lưu lịch sử
        };
        accounts.push(newAccount);
        logActivity(newId, 'CREATE', { name: newAccount.name }); // Ghi lại hành động tạo mới
        saveAccounts();
    }

    function deleteAccount(accountId) {
        if (confirm('Bạn có chắc chắn muốn xóa tài khoản này? Việc này không thể hoàn tác.')) {
            accounts = accounts.filter(acc => acc.id !== accountId);
            // Với hành động xóa, chúng ta không cần ghi log vì tài khoản không còn nữa.
            saveAccounts();
        }
    }
    
    // --- HÀM VẼ GIAO DIỆN ---

    function renderAccounts() {
        // Lưu lại vị trí scroll hiện tại để không bị giật màn hình khi render lại
        const scrollPosition = window.scrollY;

        accountsContainer.innerHTML = '';
        
        accounts.forEach(account => {
            const accDiv = document.createElement('div');
            accDiv.className = 'account';
            if (account.isLoggedOut) {
                accDiv.style.opacity = '0.6'; // Làm mờ các tài khoản đã logout
            }

            // ... HTML của mỗi thẻ vẫn tương tự như trước ...
            
            // Nút xóa
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = 'Xóa tài khoản';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Ngăn sự kiện click lan ra các phần tử cha
                deleteAccount(account.id)
            });
            
            // Header
            const header = document.createElement('div');
            header.className = 'account-header';
            const title = document.createElement('h3');
            title.textContent = account.name;
            const statusDiv = document.createElement('div');
            statusDiv.className = 'account-status';
            const logoutDot = document.createElement('div');
            logoutDot.className = 'status-dot';
            const interactDot = document.createElement('div');
            interactDot.className = 'status-dot';

            statusDiv.append(logoutDot, interactDot);
            header.append(title, statusDiv);
            
            // Ô input để đổi tên
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'name-input';
            
            // --- Options ---
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';

            // --- Tùy chọn Login/Logout ---
            const loginOption = document.createElement('div');
            loginOption.className = 'option-item';
            const loginCustomBox = document.createElement('div');
            loginCustomBox.className = 'custom-checkbox';
            const loginLabel = document.createElement('div');
            loginLabel.className = 'option-label';
            
            // Logic mới cho Login/Logout
            if (account.isLoggedOut) {
                loginLabel.textContent = 'Login'; // Nếu đã logout thì hiện nút Login
                loginCustomBox.classList.remove('checked');
                loginOption.classList.remove('active');
                logoutDot.classList.add('logout-active');
            } else {
                loginLabel.textContent = 'Logout'; // Nếu đang online thì hiện nút Logout
                loginCustomBox.classList.add('checked');
                loginOption.classList.add('active');
                logoutDot.classList.remove('logout-active');
            }

            loginOption.append(loginCustomBox, loginLabel);

            // --- Tùy chọn Tương tác ---
            const interactOption = document.createElement('div');
            interactOption.className = 'option-item';
            if (account.isLoggedOut) {
                 interactOption.style.pointerEvents = 'none'; // Vô hiệu hóa tương tác khi đã logout
                 interactOption.style.opacity = '0.5';
            }
            const interactCustomBox = document.createElement('div');
            interactCustomBox.className = 'custom-checkbox';
            const interactLabel = document.createElement('div');
            interactLabel.className = 'option-label';
            interactLabel.textContent = 'Đã tương tác';
            if (account.interacted) {
                interactCustomBox.classList.add('checked');
                interactOption.classList.add('active');
                interactDot.classList.add('interact-active');
            }
            interactOption.append(interactCustomBox, interactLabel);
            
            // Timer & Interact Time
            const timer = document.createElement('div');
            timer.className = 'timer';
            const interactTime = document.createElement('div');
            interactTime.className = 'interact-time';
            
            // --- XỬ LÝ SỰ KIỆN ---

            // Sửa tên
            title.addEventListener('click', () => { /* ...code giữ nguyên... */ });
            nameInput.addEventListener('blur', () => {
                const oldName = account.name;
                const newName = nameInput.value.trim() || 'Không tên';
                if (oldName !== newName) {
                    account.name = newName;
                    logActivity(account.id, 'RENAME', { oldName, newName });
                    saveAccounts();
                } else {
                     // Nếu tên không đổi thì chỉ ẩn input đi
                    title.style.display = 'flex';
                    nameInput.style.display = 'none';
                }
            });
            nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') nameInput.blur(); });
            
            // Login / Logout
            loginOption.addEventListener('click', () => {
                const actionType = account.isLoggedOut ? 'LOGIN' : 'LOGOUT';
                account.isLoggedOut = !account.isLoggedOut;
                logActivity(account.id, actionType);
                // Nếu vừa logout, reset trạng thái tương tác
                if (actionType === 'LOGOUT') {
                    account.interacted = false;
                    account.interactTime = null;
                }
                saveAccounts();
            });

            // Tương tác
            interactOption.addEventListener('click', () => {
                account.interacted = true;
                account.interactTime = new Date().toISOString();
                logActivity(account.id, 'INTERACT');
                saveAccounts();
            });

            // Hiển thị thời gian (tương tự như cũ)
            const lastLogout = account.history.find(log => log.type === 'LOGOUT');
            if(account.isLoggedOut && lastLogout) {
                function updateTimer() {
                    const now = new Date();
                    const diff = Math.floor((now - new Date(lastLogout.timestamp)) / 1000);
                    const h = Math.floor(diff / 3600);
                    const m = Math.floor((diff % 3600) / 60);
                    const s = diff % 60;
                    timer.textContent = `⏱️ Đã logout: ${h} giờ ${m} phút ${s} giây`;
                }
                setInterval(updateTimer, 1000);
                updateTimer();
            }
            if(account.interacted && account.interactTime) {
                // ... code hiển thị interactTime giữ nguyên ...
            }
            
            optionsDiv.append(loginOption, interactOption);
            accDiv.append(header, deleteBtn, nameInput, optionsDiv, timer, interactTime);
            accountsContainer.appendChild(accDiv);
        });
        
        // Khôi phục vị trí scroll
        window.scrollTo(0, scrollPosition);

        // Cập nhật thống kê lần cuối
        updateStats();
    }


    // --- KHỞI CHẠY ỨNG DỤNG ---
    addAccountBtn.addEventListener('click', addNewAccount);
    
    loadAccounts();
    renderAccounts();
});
