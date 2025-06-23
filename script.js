    const accounts = [];
    // SỬA LỖI 1: Sử dụng backticks ` `
    for (let i = 1; i <= 20; i++) {
      accounts.push({ id: `acc${i}`, name: `Account ${i}` });
    }

    const container = document.getElementById('accounts-container');

    function updateStats() {
      const logoutCount = document.querySelectorAll('input[id$="-logout"]:checked').length;
      const interactCount = document.querySelectorAll('input[id$="-interact"]:checked').length;
      
      document.getElementById('logout-count').textContent = logoutCount;
      document.getElementById('interact-count').textContent = interactCount;
    }

    accounts.forEach((account) => {
      const accDiv = document.createElement('div');
      accDiv.className = 'account';

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

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'name-input';

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';

      const logoutOption = document.createElement('div');
      logoutOption.className = 'option-item';

      const logoutCheckbox = document.createElement('input');
      logoutCheckbox.type = 'checkbox';
      // SỬA LỖI 2: Sử dụng backticks ` `
      logoutCheckbox.id = `${account.id}-logout`;

      const logoutCustomBox = document.createElement('div');
      logoutCustomBox.className = 'custom-checkbox';

      const logoutLabel = document.createElement('div');
      logoutLabel.className = 'option-label';
      logoutLabel.textContent = 'Logout';

      logoutOption.appendChild(logoutCheckbox);
      logoutOption.appendChild(logoutCustomBox);
      logoutOption.appendChild(logoutLabel);

      const interactOption = document.createElement('div');
      interactOption.className = 'option-item';

      const interactCheckbox = document.createElement('input');
      interactCheckbox.type = 'checkbox';
      // SỬA LỖI 3: Sử dụng backticks ` `
      interactCheckbox.id = `${account.id}-interact`;

      const interactCustomBox = document.createElement('div');
      interactCustomBox.className = 'custom-checkbox';

      const interactLabel = document.createElement('div');
      interactLabel.className = 'option-label';
      interactLabel.textContent = 'Đã tương tác';

      interactOption.appendChild(interactCheckbox);
      interactOption.appendChild(interactCustomBox);
      interactOption.appendChild(interactLabel);

      const timer = document.createElement('div');
      timer.className = 'timer';

      const interactTime = document.createElement('div');
      interactTime.className = 'interact-time';

      const saved = JSON.parse(localStorage.getItem(account.id)) || {};
      account.logoutTime = saved.logoutTime ? new Date(saved.logoutTime) : null;
      account.interactTime = saved.interactTime ? new Date(saved.interactTime) : null;
      logoutCheckbox.checked = saved.logout || false;
      interactCheckbox.checked = saved.interacted || false;
      title.textContent = saved.name || account.name;

      if (logoutCheckbox.checked) {
        logoutCustomBox.classList.add('checked');
        logoutOption.classList.add('active');
        logoutDot.classList.add('logout-active');
      }
      if (interactCheckbox.checked) {
        interactCustomBox.classList.add('checked');
        interactOption.classList.add('active');
        interactDot.classList.add('interact-active');
      }

      title.addEventListener('click', (e) => {
        e.preventDefault();
        nameInput.value = title.textContent;
        title.style.display = 'none';
        nameInput.style.display = 'block';
        nameInput.focus();
      });

      nameInput.addEventListener('blur', () => {
        const newName = nameInput.value.trim() || 'Không tên';
        title.textContent = newName;
        title.style.display = 'flex';
        nameInput.style.display = 'none';
        saveState();
      });

      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          nameInput.blur();
        }
      });

      logoutOption.addEventListener('click', (e) => {
        e.preventDefault();
        logoutCheckbox.checked = !logoutCheckbox.checked;
        
        if (logoutCheckbox.checked) {
          logoutCustomBox.classList.add('checked');
          logoutOption.classList.add('active');
          logoutDot.classList.add('logout-active');
          account.logoutTime = new Date();
        } else {
          logoutCustomBox.classList.remove('checked');
          logoutOption.classList.remove('active');
          logoutDot.classList.remove('logout-active');
          account.logoutTime = null;
          timer.textContent = '';
        }
        
        updateStats();
        saveState();
      });

      interactOption.addEventListener('click', (e) => {
        e.preventDefault();
        interactCheckbox.checked = !interactCheckbox.checked;
        
        if (interactCheckbox.checked) {
          interactCustomBox.classList.add('checked');
          interactOption.classList.add('active');
          interactDot.classList.add('interact-active');
          account.interactTime = new Date();
        } else {
          interactCustomBox.classList.remove('checked');
          interactOption.classList.remove('active');
          interactDot.classList.remove('interact-active');
          account.interactTime = null;
        }
        
        updateInteractTime();
        updateStats();
        saveState();
      });

      function updateInteractTime() {
        if (interactCheckbox.checked && account.interactTime) {
          const t = new Date(account.interactTime);
          const hours = t.getHours().toString().padStart(2, '0');
          const minutes = t.getMinutes().toString().padStart(2, '0');
          const day = t.getDate().toString().padStart(2, '0');
          const month = (t.getMonth() + 1).toString().padStart(2, '0');
          const year = t.getFullYear();
          // SỬA LỖI 4: Sử dụng backticks ` `
          interactTime.textContent = `🕒 Lúc ${hours}:${minutes} ngày ${day}/${month}/${year}`;
        } else {
          interactTime.textContent = '';
        }
      }

      function saveState() {
        localStorage.setItem(account.id, JSON.stringify({
          name: title.textContent,
          logout: logoutCheckbox.checked,
          logoutTime: account.logoutTime,
          interacted: interactCheckbox.checked,
          interactTime: account.interactTime
        }));
      }

      function updateTimer() {
        if (logoutCheckbox.checked && account.logoutTime) {
          const now = new Date();
          const diff = Math.floor((now - new Date(account.logoutTime)) / 1000);
          const h = Math.floor(diff / 3600);
          const m = Math.floor((diff % 3600) / 60);
          const s = diff % 60;
          // SỬA LỖI 5: Sử dụng backticks ` `
          timer.textContent = `⏱️ Đã logout: ${h} giờ ${m} phút ${s} giây`;
        }
      }

      setInterval(updateTimer, 1000);
      updateTimer();
      updateInteractTime();

      optionsDiv.appendChild(logoutOption);
      optionsDiv.appendChild(interactOption);

      accDiv.appendChild(header);
      accDiv.appendChild(nameInput);
      accDiv.appendChild(optionsDiv);
      accDiv.appendChild(timer);
      accDiv.appendChild(interactTime);

      container.appendChild(accDiv);
    });

    updateStats();

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gesturechange', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gestureend', (e) => {
      e.preventDefault();
    });
