// Gerenciador de estado das missões
const MissionManager = {
  currentFilter: "daily", // 'daily', 'weekly', 'special'
  missions: {
    daily: [],
    weekly: [],
    special: [],
  },

  // Inicializa as missões com dados
  initialize() {
    // Dados mockados para exemplo
    this.missions = {
      daily: [
        {
          id: 1,
          title: "Login Diário",
          description: "Entre no aplicativo",
          status: "in_progress",
          progress: 1,
          total: 1,
          reward: 50,
          type: "daily",
        },
      ],
      weekly: [
        {
          id: 2,
          title: "Vendas Semanais",
          description: "Venda 10 picanhas",
          status: "in_progress",
          progress: 0,
          total: 10,
          reward: 100,
          type: "weekly",
        },
        {
          id: 3,
          title: "Mestre do Login",
          description: "Entre no aplicativo 10 dias",
          status: "in_progress",
          progress: 2,
          total: 10,
          reward: 75,
          type: "weekly",
        },
      ],
      special: [
        {
          id: 4,
          title: "Avaliações 5 Estrelas",
          description: "Receba avaliações de nota 8+ 5x",
          status: "in_progress",
          progress: 2,
          total: 5,
          reward: 150,
          type: "special",
        },
      ],
    };
  },

  // Filtra as missões por tipo
  filterMissions(type) {
    this.currentFilter = type;
    this.updateMissionsDisplay();
    this.updateFilterButtons();
  },

  // Atualiza o display das missões baseado no filtro atual
  updateMissionsDisplay() {
    const missionsGrid = document.querySelector(".missions-grid");
    const missions = this.missions[this.currentFilter];

    missionsGrid.innerHTML = missions
      .map((mission) => this.createMissionCard(mission))
      .join("");

    // Reativa os listeners dos botões após atualizar o HTML
    this.attachCompleteButtonListeners();
  },

  // Cria o HTML para um card de missão
  createMissionCard(mission) {
    const progressPercentage = (mission.progress / mission.total) * 100;
    const statusText =
      mission.progress >= mission.total ? "Completar" : "Em andamento";

    return `
            <article class="mission" data-mission-id="${mission.id}">
                <div class="mission-header">
                    <div class="mission-info">
                        <h3 class="mission-title">${mission.title}</h3>
                        <span class="mission-status">${statusText}</span>
                    </div>
                    <span class="mission-reward">+${mission.reward} XP</span>
                </div>
                <p class="mission-desc">${mission.description}</p>
                <div class="progress" role="progressbar" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100">
                    <i style="width:${progressPercentage}%"></i>
                </div>
                <div class="mission-footer">
                    <span class="progress-text">${mission.progress}/${
      mission.total
    } ${this.getProgressUnit(mission)}</span>
                    <button class="btn complete" aria-label="Completar ${
                      mission.title
                    }"
                            ${
                              mission.progress < mission.total ? "disabled" : ""
                            }>
                        <i class="fas fa-check"></i>
                        Completar
                    </button>
                </div>
            </article>
        `;
  },

  // Retorna a unidade apropriada para o progresso baseado no tipo de missão
  getProgressUnit(mission) {
    const units = {
      "Login Diário": "login",
      "Vendas Semanais": "vendas",
      "Mestre do Login": "dias",
      "Avaliações 5 Estrelas": "avaliações",
    };
    return units[mission.title] || "completado";
  },

  // Atualiza o estado visual dos botões de filtro
  updateFilterButtons() {
    const buttons = document.querySelectorAll(".mission-filters .btn");
    buttons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });

    const activeButton = document.querySelector(
      `.mission-filters .btn[data-filter="${this.currentFilter}"]`
    );
    if (activeButton) {
      activeButton.classList.add("active");
      activeButton.setAttribute("aria-pressed", "true");
    }
  },

  // Completa uma missão
  completeMission(missionId) {
    // Encontra a missão em todas as categorias
    for (const type in this.missions) {
      const mission = this.missions[type].find((m) => m.id === missionId);
      if (mission && mission.progress >= mission.total) {
        // Aqui você adicionaria a lógica para salvar no backend
        this.showRewardAnimation(mission.reward);
        mission.status = "completed";
        this.updateMissionsDisplay();
        break;
      }
    }
  },

  // Mostra uma animação quando a recompensa é recebida
  showRewardAnimation(xp) {
    const reward = document.createElement("div");
    reward.className = "reward-popup";
    reward.innerHTML = `+${xp} XP`;
    document.body.appendChild(reward);

    // Remove o elemento após a animação
    setTimeout(() => {
      reward.remove();
    }, 2000);
  },

  // Anexa os event listeners aos botões de completar
  attachCompleteButtonListeners() {
    const completeButtons = document.querySelectorAll(".btn.complete");
    completeButtons.forEach((button) => {
      const missionId = parseInt(button.closest(".mission").dataset.missionId);
      button.onclick = () => this.completeMission(missionId);
    });
  },
};

// Inicialização quando o documento carrega
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o gerenciador de missões
  MissionManager.initialize();

  // Configura os listeners dos botões de filtro
  const filterButtons = document.querySelectorAll(".mission-filters .btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.textContent.trim().toLowerCase().includes("diárias")
        ? "daily"
        : button.textContent.trim().toLowerCase().includes("semanais")
        ? "weekly"
        : "special";
      MissionManager.filterMissions(filter);
    });
  });

  // Adiciona atributos data-filter aos botões
  const buttons = document.querySelectorAll(".mission-filters .btn");
  buttons[0].setAttribute("data-filter", "daily");
  buttons[1].setAttribute("data-filter", "weekly");
  buttons[2].setAttribute("data-filter", "special");

  // Mostra as missões diárias por padrão
  MissionManager.filterMissions("daily");
});

// Adiciona os estilos necessários para a animação de recompensa
const style = document.createElement("style");
style.textContent = `
    .reward-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--orange);
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius);
        font-weight: bold;
        font-size: 24px;
        animation: rewardPopup 2s ease-out forwards;
        z-index: 1000;
    }

    @keyframes rewardPopup {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        30% {
            transform: translate(-50%, -50%) scale(1);
        }
        70% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);
