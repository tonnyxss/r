    let baseUrl = 'https://www.habbo.com.br/habbo-imaging/avatarimage?hb=img&user=';
    let isChecking = false;
    let totalNicks = 0;
    let startTime = 0;

    function setBaseUrl(button, url) {
      if (isChecking) {
        isChecking = false;
        completedMessage.textContent = "Verificação interrompida. Por favor, faça o upload da wordlist novamente.";
      }

      baseUrl = url;
      document.querySelectorAll('.controls button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      availableConsole.textContent = "";
      unavailableConsole.textContent = "";
      fileInput.value = "";
    }

    const fileInput = document.getElementById("fileInput");
    const availableConsole = document.getElementById("availableConsole");
    const unavailableConsole = document.getElementById("unavailableConsole");
    const completedMessage = document.getElementById("completed-message");

    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const lines = event.target.result.split("\n").map(l => l.trim()).filter(Boolean);
        checkNicknames(lines);
      };
      reader.readAsText(file);
    });

    async function checkNicknames(nicks) {
      availableConsole.textContent = "";
      unavailableConsole.textContent = "";
      completedMessage.textContent = "";
      isChecking = true;
      totalNicks = nicks.length;
      startTime = Date.now();

      for (let i = 0; i < nicks.length; i++) {
        if (!isChecking) return;
        const nick = nicks[i];
        const url = baseUrl + encodeURIComponent(nick);
        await checkNickname(nick, url);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      if (isChecking) {
        completedMessage.textContent = "Verificação concluída.";
        isChecking = false;
        updateTestSummary();
      }
    }

    function checkNickname(nick, url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const p = document.createElement("div");
          p.textContent = "> " + nick;
          unavailableConsole.appendChild(p);
          scrollToBottom(unavailableConsole);
          resolve();
        };
        img.onerror = () => {
          const p = document.createElement("div");
          p.textContent = "> " + nick;
          availableConsole.appendChild(p);
          scrollToBottom(availableConsole);
          resolve();
        };
        img.src = url;
      });
    }

    function scrollToBottom(element) {
      element.scrollTop = element.scrollHeight;
    }

    function updateTestSummary() {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = Math.floor(elapsedTime % 60);
      document.getElementById('test-summary').textContent = `${totalNicks} nicks testados em ${minutes} minutos e ${seconds} segundos.`;
    }

    function toggleTheme() {
      const isLight = document.body.classList.toggle('light-mode');
      document.cookie = `theme=${isLight ? 'light' : 'dark'}; path=/; max-age=31536000`;
    }

    window.addEventListener("DOMContentLoaded", () => {
      const match = document.cookie.match(/theme=(light|dark)/);
      if (match) {
        if (match[1] === "light") {
          document.body.classList.add("light-mode");
        }
      }
    });