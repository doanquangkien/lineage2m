// ===================================================================
//                 QUẢN LÝ TÀI KHOẢN LINEAGE2M - v2.0
//                 Code đã được cấu trúc lại
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- KHAI BÁO BIẾN TOÀN CỤC ---
    const accountsContainer = document.getElementById('accounts-container');
    const addAccountBtn = document.getElementById('add-account-btn');
    const totalAccountsEl = document.getElementById('total-accounts');
    const logoutCountEl = document.getElementById('logout-count');
    const interactCountEl = document.getElementById('interact-count');
    
    // `accounts` là nguồn dữ liệu chính, tất cả thay đổi sẽ được cập nhật ở đây.
    let accounts = [];

    // --- CÁC HÀM QUẢN LÝ DỮ LIỆU ---

    /**
     * Tải danh sách tài khoản từ localStorage.
     * Nếu không có gì, sẽ khởi tạo một mảng rỗng.
     */
    function loadAccounts() {
        const savedAccounts = localStorage.getItem('lineage2m_accounts_data');
        accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
    }

    /**
     * Lưu danh sách tài khoản hiện tại vào localStorage.
     * Hàm này sẽ được gọi mỗi khi có sự thay đổi dữ liệu.
     */
    function saveAccounts() {
        localStorage.setItem('lineage2m_accounts_data', JSON.stringify(accounts));
        updateStats(); // Cập nhật thống kê mỗi khi lưu
    }
    
    /**
     * Cập nhật các con số thống kê ở thanh trên cùng.
     */
    function updateStats() {
        const logoutCount = accounts.filter(acc => acc.logout).length;
        const interactCount = accounts.filter(acc => acc.interacted).length;
        
        totalAccountsEl.textContent = accounts.length;
        logoutCountEl.textContent = logoutCount;
        interactCountEl.textContent = interactCount;
    }
    
    // --- CÁC HÀM HÀNH ĐỘNG (THÊM/XÓA/SỬA) ---

    /**
     * Thêm một tài khoản mới vào danh sách.
     */
    function addNewAccount() {
        const newAccount = {
            id: Date.now(), // Sử dụng timestamp làm ID duy nhất, rất hiệu quả
            name: `Account ${accounts.length + 1}`,
            logout: false,
            logoutTime: null,
            interacted: false,
            interactTime: null,
        };
        accounts.push(newAccount);
        saveAccounts();
        renderAccounts(); // Vẽ lại toàn bộ danh sách để hiển thị tài khoản mới
    }

    /**
     * Xóa một tài khoản dựa trên ID của nó.
     * @param {number} accountId ID của tài khoản cần xóa
     */
    function deleteAccount(accountId) {
        if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
            accounts = accounts.filter(acc => acc.id !== accountId);
            saveAccounts();
            renderAccounts(); // Vẽ lại toàn bộ danh sách
        }
    }
    
    // --- HÀM QUAN TRỌNG NHẤT: VẼ GIAO DIỆN ---

    /**
     * Hàm này chịu trách nhiệm vẽ toàn bộ danh sách tài khoản ra màn hình
     * dựa trên dữ liệu từ mảng `accounts`. Nó sẽ được gọi mỗi khi có thay đổi.
     */
    function renderAccounts() {
        // 1. Xóa sạch mọi thứ đang có trong container
        accountsContainer.innerHTML = '';
        
        // 2. Lặp qua mảng `accounts` và tạo HTML cho từng tài khoản
        accounts.forEach(account => {
            const accDiv = document.createElement('div');
            accDiv.className = 'account';
            accDiv.dataset.id = account.id; // Lưu id vào data attribute

            // Clone lại code HTML từ phiên bản cũ của bạn, nhưng giờ nó nằm trong một vòng lặp
            // và dữ liệu được lấy từ `account` object.
            
            // Nút xóa
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×'; // Ký tự 'x'
            deleteBtn.title = 'Xóa tài khoản';
            deleteBtn.addEventListener('click', () => deleteAccount(account.id));
            
            // Header
            const header = document.createElement('div');
            header.className = 'account-header';

            const title = document.createElement('h3');
            title.textContent = account.name;

            const statusDiv = document.createElement('div');
            statusDiv.className = 'account-status';
            
            const logoutDot = document.createElement('div');
            logoutDot.className = 'status-dot';
            logoutDot.title = 'Logout status';

            const interactDot = document.createElement('div');
            interactDot.className = 'status-dot';
            interactDot.title = 'Interact status';

            statusDiv.appendChild(logoutDot);
            statusDiv.appendChild(interactDot);

            header.appendChild(title);
            header.appendChild(statusDiv);
            
            // Ô input để đổi tên
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'name-input';

            // Options (logout, interact)
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';

            // --- Tùy chọn Logout ---
            const logoutOption = document.createElement('div');
            logoutOption.className = 'option-item';

            const logoutCustomBox = document.createElement('div');
            logoutCustomBox.className = 'custom-checkbox';

            const logoutLabel = document.createElement('div');
            logoutLabel.className = 'option-label';
            logoutLabel.textContent = 'Logout';

            logoutOption.append(logoutCustomBox, logoutLabel);

            // --- Tùy chọn Tương tác ---
            const interactOption = document.createElement('div');
            interactOption.className = 'option-item';

            const interactCustomBox = document.createElement('div');
            interactCustomBox.className = 'custom-checkbox';

            const interactLabel = document.createElement('div');
            interactLabel.className = 'option-label';
            interactLabel.textContent = 'Đã tương tác';
            
            interactOption.append(interactCustomBox, interactLabel);
            
            optionsDiv.append(logoutOption, interactOption);
            
            // Timer
            const timer = document.createElement('div');
            timer.className = 'timer';

            const interactTime = document.createElement('div');
            interactTime.className = 'interact-time';

            // --- CẬP NHẬT GIAO DIỆN BAN ĐẦU TỪ DỮ LIỆU ---
            if (account.logout) {
                logoutCustomBox.classList.add('checked');
                logoutOption.classList.add('active');
                logoutDot.classList.add('logout-active');
            }
            if (account.interacted) {
                interactCustomBox.classList.add('checked');
                interactOption.classList.add('active');
                interactDot.classList.add('interact-active');
            }

            // --- LOGIC EVENT LISTENERS ---

            // Click vào tiêu đề để sửa tên
            title.addEventListener('click', (e) => {
                e.preventDefault();
                nameInput.value = title.textContent;
                title.style.display = 'none';
                nameInput.style.display = 'block';
                nameInput.focus();
            });

            // Khi ô input mất focus (blur)
            nameInput.addEventListener('blur', () => {
                const newName = nameInput.value.trim() || 'Không tên';
                title.textContent = newName;
                title.style.display = 'flex';
                nameInput.style.display = 'none';
                // Cập nhật tên vào mảng accounts và lưu lại
                account.name = newName;
                saveAccounts();
            });

            // Bấm Enter để xác nhận đổi tên
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    nameInput.blur();
                }
            });

            // Click vào tùy chọn Logout
            logoutOption.addEventListener('click', () => {
                account.logout = !account.logout; // Đảo ngược trạng thái
                if (account.logout) {
                    account.logoutTime = new Date().toISOString();
                } else {
                    account.logoutTime = null;
                }
                saveAccounts();
                renderAccounts(); // Vẽ lại để cập nhật thay đổi
            });

            // Click vào tùy chọn Tương tác
            interactOption.addEventListener('click', () => {
                account.interacted = !account.interacted; // Đảo ngược trạng thái
                if (account.interacted) {
                    account.interactTime = new Date().toISOString();
                } else {
                    account.interactTime = null;
                }
                saveAccounts();
                renderAccounts(); // Vẽ lại để cập nhật
            });
            
            // --- HÀM CẬP NHẬT THỜI GIAN (TIMER) ---
            function updateDisplayTimes() {
                if (account.logout && account.logoutTime) {
                    const now = new Date();
                    const diff = Math.floor((now - new Date(account.logoutTime)) / 1000);
                    const h = Math.floor(diff / 3600);
                    const m = Math.floor((diff % 3600) / 60);
                    const s = diff % 60;
                    timer.textContent = `⏱️ Đã logout: ${h} giờ ${m} phút ${s} giây`;
                } else {
                    timer.textContent = '';
                }

                if (account.interacted && account.interactTime) {
                    const t = new Date(account.interactTime);
                    const hours = t.getHours().toString().padStart(2, '0');
                    const minutes = t.getMinutes().toString().padStart(2, '0');
                    const day = t.getDate().toString().padStart(2, '0');
                    const month = (t.getMonth() + 1).toString().padStart(2, '0');
                    interactTime.textContent = `🕒 Lúc ${hours}:${minutes} ngày ${day}/${month}`;
                } else {
                    interactTime.textContent = '';
                }
            }
            
            setInterval(updateDisplayTimes, 1000);
            updateDisplayTimes();

            // Ghép tất cả các phần tử lại và bỏ vào container
            accDiv.append(header, deleteBtn, nameInput, optionsDiv, timer, interactTime);
            accountsContainer.appendChild(accDiv);
        });
    }

    // --- KHỞI CHẠY ỨNG DỤNG ---

    addAccountBtn.addEventListener('click', addNewAccount);

    // Tải dữ liệu, vẽ giao diện lần đầu và cập nhật thống kê
    loadAccounts();
    renderAccounts();
    updateStats();
    
});
