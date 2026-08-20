const FALLBACK_BACKEND_URL = "https://ia-previsao-ritmo-backend.onrender.com";
const AUTH_TOKEN_STORAGE_KEY = "radarPreventivo.authToken";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
});

const urlParams = new URLSearchParams(window.location.search);

const DEMO_HEALTH = {
    model_ready: true,
    records_loaded: 30,
    historical_window: {
        start: "2026-01-01",
        end: "2026-01-30",
    },
    suggested_prediction_date: "2026-01-31",
    forecast_days: 45,
    predictor_mode: "demo",
    backend_name: "synthetic-demo-payload",
};

const DEMO_USERS = [
    {
        id: "admin-demo",
        name: "Admin Demo",
        email: "admin@radar.local",
        role: "admin",
        role_title: "Administrador",
        permissions: ["dashboard:view", "users:read", "auth:manage"],
        active: true,
    },
    {
        id: "gestor-demo",
        name: "Gestor Demo",
        email: "gestor@radar.local",
        role: "gestor",
        role_title: "Gestor Operacional",
        permissions: ["dashboard:view"],
        active: true,
    },
    {
        id: "analista-demo",
        name: "Analista Demo",
        email: "analista@radar.local",
        role: "analista",
        role_title: "Analista",
        permissions: ["dashboard:view"],
        active: true,
    },
];

const DEMO_TEMPLATE = {
    previsao_total_yhat1: 7.43,
    forecast_period_start: "2026-01-31",
    forecast_period_end: "2026-03-16",
    top_10_motoristas_geral: [
        { Motorista: "CONDUTOR-SINTETICO-03", ParticipacaoPercentual: 23.81, VolumeHistorico: 50, EventosEsperados: 1.77 },
        { Motorista: "CONDUTOR-SINTETICO-02", ParticipacaoPercentual: 16.67, VolumeHistorico: 35, EventosEsperados: 1.24 },
        { Motorista: "CONDUTOR-SINTETICO-05", ParticipacaoPercentual: 16.67, VolumeHistorico: 35, EventosEsperados: 1.24 },
        { Motorista: "CONDUTOR-SINTETICO-01", ParticipacaoPercentual: 9.52, VolumeHistorico: 20, EventosEsperados: 0.71 },
        { Motorista: "CONDUTOR-SINTETICO-04", ParticipacaoPercentual: 9.52, VolumeHistorico: 20, EventosEsperados: 0.71 },
    ],
    top_3_localidades: [
        { Localidade: "ZONA-DEMO-C", ParticipacaoPercentual: 47.62, VolumeHistorico: 100, EventosEsperados: 3.54 },
        { Localidade: "ZONA-DEMO-B", ParticipacaoPercentual: 33.33, VolumeHistorico: 70, EventosEsperados: 2.48 },
        { Localidade: "ZONA-DEMO-A", ParticipacaoPercentual: 19.05, VolumeHistorico: 40, EventosEsperados: 1.42 },
    ],
    top_tipos_evento: [
        { TipoEvento: "FADIGA-DEMO", ParticipacaoPercentual: 28.1, VolumeHistorico: 59, EventosEsperados: 2.09 },
        { TipoEvento: "ACELERACAO-DEMO", ParticipacaoPercentual: 25.24, VolumeHistorico: 53, EventosEsperados: 1.88 },
        { TipoEvento: "DIRECAO-BRUSCA-DEMO", ParticipacaoPercentual: 24.76, VolumeHistorico: 52, EventosEsperados: 1.84 },
        { TipoEvento: "GESTAO-RISCO-DEMO", ParticipacaoPercentual: 21.9, VolumeHistorico: 46, EventosEsperados: 1.63 },
    ],
    probabilidade_eventos_especificos: {
        "FADIGA-DEMO": [
            { Motorista: "CONDUTOR-SINTETICO-02", VolumeHistorico: 21, ParticipacaoNoEventoPercentual: 35.59, EventosEsperados: 0.74 },
            { Motorista: "CONDUTOR-SINTETICO-04", VolumeHistorico: 8, ParticipacaoNoEventoPercentual: 13.56, EventosEsperados: 0.28 },
        ],
        "ACELERACAO-DEMO": [
            { Motorista: "CONDUTOR-SINTETICO-05", VolumeHistorico: 21, ParticipacaoNoEventoPercentual: 39.62, EventosEsperados: 0.74 },
            { Motorista: "CONDUTOR-SINTETICO-03", VolumeHistorico: 20, ParticipacaoNoEventoPercentual: 37.74, EventosEsperados: 0.71 },
            { Motorista: "CONDUTOR-SINTETICO-01", VolumeHistorico: 12, ParticipacaoNoEventoPercentual: 22.64, EventosEsperados: 0.43 },
        ],
        "DIRECAO-BRUSCA-DEMO": [
            { Motorista: "CONDUTOR-SINTETICO-03", VolumeHistorico: 30, ParticipacaoNoEventoPercentual: 57.69, EventosEsperados: 1.06 },
            { Motorista: "CONDUTOR-SINTETICO-05", VolumeHistorico: 14, ParticipacaoNoEventoPercentual: 26.92, EventosEsperados: 0.5 },
            { Motorista: "CONDUTOR-SINTETICO-01", VolumeHistorico: 8, ParticipacaoNoEventoPercentual: 15.38, EventosEsperados: 0.28 },
        ],
        "GESTAO-RISCO-DEMO": [
            { Motorista: "CONDUTOR-SINTETICO-02", VolumeHistorico: 14, ParticipacaoNoEventoPercentual: 30.43, EventosEsperados: 0.5 },
            { Motorista: "CONDUTOR-SINTETICO-04", VolumeHistorico: 12, ParticipacaoNoEventoPercentual: 26.09, EventosEsperados: 0.42 },
        ],
    },
    serie_historica_recente: [
        { data: "2026-01-17", total: 7 },
        { data: "2026-01-18", total: 10 },
        { data: "2026-01-19", total: 4 },
        { data: "2026-01-20", total: 7 },
        { data: "2026-01-21", total: 10 },
        { data: "2026-01-22", total: 4 },
        { data: "2026-01-23", total: 7 },
        { data: "2026-01-24", total: 10 },
        { data: "2026-01-25", total: 4 },
        { data: "2026-01-26", total: 7 },
        { data: "2026-01-27", total: 10 },
        { data: "2026-01-28", total: 4 },
        { data: "2026-01-29", total: 7 },
        { data: "2026-01-30", total: 10 },
    ],
    resumo_executivo: {
        nivel_risco: "moderado",
        indice_risco_relativo: 1.061,
        variacao_media_percentual: 6.14,
        media_diaria_historica: 7.0,
        pico_diario_historico: 10,
        motorista_prioritario: "CONDUTOR-SINTETICO-03",
        localidade_critica: "ZONA-DEMO-C",
        tipo_evento_lider: "FADIGA-DEMO",
    },
    insights_prioritarios: [
        "Cenario sintetico moderado: a previsao demonstra o contrato sem representar uma operacao real.",
        "CONDUTOR-SINTETICO-03 e apenas um identificador artificial de demonstracao.",
        "ZONA-DEMO-C e uma categoria ficticia, sem coordenadas ou endereco real.",
        "FADIGA-DEMO lidera somente este conjunto deterministico de exemplo.",
    ],
    dataset_contexto: {
        total_registros: 30,
        total_eventos_historicos: 210,
        motoristas_monitorados: 6,
        localidades_monitoradas: 3,
        tipos_evento_monitorados: 4,
        janela_historica_inicio: "2026-01-01",
        janela_historica_fim: "2026-01-30",
        ultima_atualizacao_arquivo: "2026-01-30 00:00",
        motoristas_desligados_filtrados: 1,
    },
    meta: {
        backend: "synthetic-demo-payload",
        forecast_days: 45,
        recent_history_days: 14,
        predictor_mode: "demo",
    },
};

const refs = {};
const state = {
    apiBaseUrl: "",
    health: null,
    prediction: null,
    session: null,
    demoMode: urlParams.get("demo") === "1",
    demoRole: urlParams.get("demoRole") || "analista",
};


document.addEventListener("DOMContentLoaded", async () => {
    cacheRefs();
    bindEvents();
    state.apiBaseUrl = resolveBackendUrl();

    if (state.demoMode) {
        activateDemoMode();
        return;
    }

    setSystemStatus("Conectando ao backend preditivo");
    await loadHealth();

    const restoredSession = await restoreSession();
    if (restoredSession) {
        showAppShell();
        await loadPrediction();
        await loadAdminDirectory();
    } else {
        showAuthGate();
    }
});


function cacheRefs() {
    refs.authGate = document.getElementById("authGate");
    refs.appShell = document.getElementById("appShell");
    refs.loginForm = document.getElementById("loginForm");
    refs.emailInput = document.getElementById("emailInput");
    refs.passwordInput = document.getElementById("passwordInput");
    refs.loginButton = document.getElementById("loginButton");
    refs.loginMessage = document.getElementById("loginMessage");
    refs.sessionShell = document.getElementById("sessionShell");
    refs.sessionRoleLabel = document.getElementById("sessionRoleLabel");
    refs.sessionUserLabel = document.getElementById("sessionUserLabel");
    refs.logoutButton = document.getElementById("logoutButton");

    refs.form = document.getElementById("predictionForm");
    refs.predictionDateInput = document.getElementById("predictionDate");
    refs.fetchDataButton = document.getElementById("fetchDataButton");
    refs.loadingSection = document.getElementById("loading");
    refs.predictionResultsSection = document.getElementById("predictionResults");
    refs.errorDisplaySection = document.getElementById("errorDisplay");
    refs.errorMessage = document.getElementById("errorMessage");
    refs.errorDetails = document.getElementById("errorDetails");

    refs.systemStatusLabel = document.getElementById("systemStatusLabel");
    refs.forecastWindowLabel = document.getElementById("forecastWindowLabel");
    refs.lastUpdatedLabel = document.getElementById("lastUpdatedLabel");
    refs.controlHelperText = document.getElementById("controlHelperText");

    refs.historicalWindowValue = document.getElementById("historicalWindowValue");
    refs.recordsValue = document.getElementById("recordsValue");
    refs.driversValue = document.getElementById("driversValue");
    refs.eventTypesValue = document.getElementById("eventTypesValue");

    refs.forecastTotalValue = document.getElementById("forecastTotalValue");
    refs.forecastDateValue = document.getElementById("forecastDateValue");
    refs.riskLevelValue = document.getElementById("riskLevelValue");
    refs.riskVariationValue = document.getElementById("riskVariationValue");
    refs.historicalAverageValue = document.getElementById("historicalAverageValue");
    refs.historicalPeakValue = document.getElementById("historicalPeakValue");
    refs.priorityTargetValue = document.getElementById("priorityTargetValue");
    refs.prioritySupportValue = document.getElementById("prioritySupportValue");

    refs.executiveTitle = document.getElementById("executiveTitle");
    refs.executiveSummary = document.getElementById("executiveSummary");
    refs.riskPill = document.getElementById("riskPill");
    refs.trendWindowLabel = document.getElementById("trendWindowLabel");
    refs.trendBars = document.getElementById("trendBars");
    refs.insightsList = document.getElementById("insightsList");
    refs.podiumGrid = document.getElementById("podiumGrid");
    refs.topDriversList = document.getElementById("topDriversList");
    refs.localitiesList = document.getElementById("localitiesList");
    refs.eventTypesBars = document.getElementById("eventTypesBars");
    refs.eventBreakdownGrid = document.getElementById("eventBreakdownGrid");
    refs.adminPanel = document.getElementById("adminPanel");
    refs.usersDirectoryList = document.getElementById("usersDirectoryList");
}


function bindEvents() {
    refs.loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await login();
    });

    refs.form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await loadPrediction();
    });

    refs.logoutButton.addEventListener("click", async () => {
        await logout();
    });
}


function activateDemoMode() {
    state.health = DEMO_HEALTH;
    applySession(
        {
            access_token: "demo-token",
            user: buildDemoUser(state.demoRole),
        },
        false
    );
    refs.predictionDateInput.value = DEMO_HEALTH.suggested_prediction_date;
    renderHealthContext(DEMO_HEALTH);
    showAppShell();
    state.prediction = buildDemoPrediction(refs.predictionDateInput.value);
    renderDashboard(state.prediction);
    refs.predictionResultsSection.classList.remove("hidden");
    renderUsersDirectory(state.demoRole === "admin" ? DEMO_USERS : []);
    setSystemStatus("Modo demo ativo para apresentação e screenshots");
}


function buildDemoUser(role) {
    const fallbackUser = DEMO_USERS.find((user) => user.role === "analista");
    const selectedUser = DEMO_USERS.find((user) => user.role === role) || fallbackUser;
    return {
        ...selectedUser,
        role_description: "Sessão demonstrativa carregada localmente.",
    };
}


function buildDemoPrediction(selectedDate) {
    const clonedPayload = JSON.parse(JSON.stringify(DEMO_TEMPLATE));
    clonedPayload.data_previsao = selectedDate || DEMO_HEALTH.suggested_prediction_date;
    return clonedPayload;
}


async function loadHealth() {
    try {
        const response = await fetch(`${state.apiBaseUrl}/health`);
        if (!response.ok) {
            throw new Error("Não foi possível consultar a saúde do backend.");
        }

        state.health = await response.json();
        renderHealthContext(state.health);
        setSystemStatus(
            state.health.model_ready
                ? "Backend pronto para autenticação e previsão"
                : "Backend conectado, aguardando preparo do modelo"
        );
    } catch (_error) {
        setSystemStatus("Healthcheck indisponível, aguardando autenticação manual");
    }
}


async function restoreSession() {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${state.apiBaseUrl}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            clearSession();
            return false;
        }

        const session = await response.json();
        applySession(session, false);
        setLoginMessage("Sessão restaurada com sucesso.", "success");
        return true;
    } catch (_error) {
        clearSession();
        return false;
    }
}


async function login() {
    const email = refs.emailInput.value.trim();
    const password = refs.passwordInput.value;

    if (!email || !password) {
        setLoginMessage("Informe e-mail e senha para continuar.", "error");
        return;
    }

    refs.loginButton.disabled = true;
    refs.loginButton.textContent = "Entrando...";
    setLoginMessage("Validando credenciais e perfil...", null);

    try {
        const response = await fetch(`${state.apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const payload = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                payload,
            };
        }

        applySession(payload, true);
        showAppShell();
        setLoginMessage("Acesso concedido. Carregando o painel protegido...", "success");
        await loadPrediction();
        await loadAdminDirectory();
    } catch (error) {
        const errorMessage = error?.payload?.error || "Não foi possível autenticar este usuário.";
        setLoginMessage(errorMessage, "error");
        setSystemStatus("Falha na autenticação");
    } finally {
        refs.loginButton.disabled = false;
        refs.loginButton.textContent = "Entrar no painel";
    }
}


async function logout() {
    if (!state.demoMode && state.session?.access_token) {
        try {
            await fetch(`${state.apiBaseUrl}/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${state.session.access_token}`,
                },
            });
        } catch (_error) {
        }
    }

    clearSession();
    showAuthGate();
    refs.loginForm.reset();
    refs.adminPanel.classList.add("hidden");
    refs.usersDirectoryList.innerHTML = "";
    setLoginMessage("Sessão encerrada com sucesso.", "success");
    setSystemStatus("Aguardando autenticação");
}


function applySession(session, persistToken) {
    state.session = session;
    refs.sessionShell.classList.remove("hidden");
    refs.sessionRoleLabel.textContent = session.user.role_title || session.user.role;
    refs.sessionUserLabel.textContent = session.user.name;

    if (!state.demoMode && persistToken) {
        window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.access_token);
    }
}


function clearSession() {
    state.session = null;
    refs.sessionShell.classList.add("hidden");
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}


async function loadPrediction() {
    if (!state.demoMode && !state.session?.access_token) {
        showAuthGate();
        setLoginMessage("Faça login para consultar previsões protegidas.", "error");
        return;
    }

    const selectedDate = refs.predictionDateInput.value || state.health?.suggested_prediction_date;
    if (!selectedDate) {
        handlePredictionError({
            message: "Selecione uma data para consultar a previsão.",
            details: "A consulta depende de uma data no formato YYYY-MM-DD.",
        });
        return;
    }

    refs.predictionDateInput.value = selectedDate;
    setLoading(true);
    clearPredictionError();

    try {
        if (state.demoMode) {
            state.prediction = buildDemoPrediction(selectedDate);
        } else {
            const response = await fetch(`${state.apiBaseUrl}/predict?date=${selectedDate}`, {
                headers: {
                    Authorization: `Bearer ${state.session.access_token}`,
                },
            });
            const payload = await response.json();

            if (response.status === 401 || response.status === 403) {
                clearSession();
                showAuthGate();
                setLoginMessage("Sua sessão expirou ou o perfil não possui acesso a este painel.", "error");
                return;
            }

            if (!response.ok) {
                throw {
                    status: response.status,
                    payload,
                };
            }

            state.prediction = payload;
        }

        renderDashboard(state.prediction);
        refs.predictionResultsSection.classList.remove("hidden");
        setSystemStatus("Painel sincronizado com a última previsão");
    } catch (error) {
        handlePredictionError(error);
    } finally {
        setLoading(false);
    }
}


async function loadAdminDirectory() {
    if (!state.session || state.session.user.role !== "admin") {
        refs.adminPanel.classList.add("hidden");
        refs.usersDirectoryList.innerHTML = "";
        return;
    }

    if (state.demoMode) {
        renderUsersDirectory(DEMO_USERS);
        return;
    }

    try {
        const response = await fetch(`${state.apiBaseUrl}/auth/users`, {
            headers: {
                Authorization: `Bearer ${state.session.access_token}`,
            },
        });
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.error || "Não foi possível carregar o diretório de usuários.");
        }

        renderUsersDirectory(payload.users || []);
    } catch (_error) {
        renderUsersDirectory([]);
    }
}


function renderHealthContext(health) {
    if (!health) {
        return;
    }

    if (!refs.predictionDateInput.value && health.suggested_prediction_date) {
        refs.predictionDateInput.value = health.suggested_prediction_date;
    }

    if (health.suggested_prediction_date && health.forecast_days) {
        const forecastStart = parseIsoDate(health.suggested_prediction_date);
        const forecastEnd = addDays(forecastStart, health.forecast_days - 1);
        refs.forecastWindowLabel.textContent =
            `${formatDate(health.suggested_prediction_date)} até ${formatDate(formatInputDate(forecastEnd))}`;
    }

    if (health.historical_window?.start && health.historical_window?.end) {
        refs.historicalWindowValue.textContent =
            `${formatDate(health.historical_window.start)} até ${formatDate(health.historical_window.end)}`;
    }

    refs.recordsValue.textContent = formatCompact(health.records_loaded);
    refs.controlHelperText.textContent = health.suggested_prediction_date
        ? "A data inicial foi posicionada automaticamente na primeira janela de previsão disponível."
        : "Selecione uma data dentro da janela prevista pelo modelo.";
}


function renderDashboard(payload) {
    renderContext(payload);
    renderMetrics(payload);
    renderExecutivePanel(payload);
    renderInsights(payload.insights_prioritarios || []);
    renderPodium(payload.top_10_motoristas_geral || []);
    renderRankedStack(
        refs.topDriversList,
        payload.top_10_motoristas_geral || [],
        {
            labelKey: "Motorista",
            subtitle: (item) =>
                `${formatPercent(item.ParticipacaoPercentual)} do histórico | ${formatDecimal(item.EventosEsperados)} eventos esperados`,
        }
    );
    renderRankedStack(
        refs.localitiesList,
        payload.top_3_localidades || [],
        {
            labelKey: "Localidade",
            subtitle: (item) =>
                `${formatPercent(item.ParticipacaoPercentual)} de concentração | ${formatDecimal(item.EventosEsperados)} eventos esperados`,
        }
    );
    renderEventTypes(payload.top_tipos_evento || []);
    renderEventBreakdown(payload.probabilidade_eventos_especificos || {});
}


function renderContext(payload) {
    const context = payload.dataset_contexto || {};

    refs.forecastWindowLabel.textContent =
        `${formatDate(payload.forecast_period_start)} até ${formatDate(payload.forecast_period_end)}`;
    refs.lastUpdatedLabel.textContent = context.ultima_atualizacao_arquivo || "Não informado";
    refs.historicalWindowValue.textContent =
        context.janela_historica_inicio && context.janela_historica_fim
            ? `${formatDate(context.janela_historica_inicio)} até ${formatDate(context.janela_historica_fim)}`
            : "-";
    refs.recordsValue.textContent = formatCompact(context.total_registros);
    refs.driversValue.textContent = formatCompact(context.motoristas_monitorados);
    refs.eventTypesValue.textContent = formatCompact(context.tipos_evento_monitorados);
    refs.controlHelperText.textContent =
        `Janela prevista: ${formatDate(payload.forecast_period_start)} até ${formatDate(payload.forecast_period_end)}.`;
}


function renderMetrics(payload) {
    const summary = payload.resumo_executivo || {};
    const priorityPieces = [
        summary.localidade_critica,
        summary.tipo_evento_lider,
    ].filter(Boolean);

    refs.forecastTotalValue.textContent = formatDecimal(payload.previsao_total_yhat1);
    refs.forecastDateValue.textContent = `Cenário de ${formatDate(payload.data_previsao)}`;
    refs.riskLevelValue.textContent = formatRisk(summary.nivel_risco);
    refs.riskVariationValue.textContent = summary.variacao_media_percentual === null
        ? "Sem comparativo"
        : `${formatSignedPercent(summary.variacao_media_percentual)} vs média diária`;
    refs.historicalAverageValue.textContent = formatDecimal(summary.media_diaria_historica);
    refs.historicalPeakValue.textContent = summary.pico_diario_historico === null
        ? "Pico histórico indisponível"
        : `Pico histórico: ${formatDecimal(summary.pico_diario_historico)} eventos/dia`;
    refs.priorityTargetValue.textContent = summary.motorista_prioritario || "Sem motorista crítico";
    refs.prioritySupportValue.textContent = priorityPieces.length
        ? priorityPieces.join(" | ")
        : "Aguardando identificação de hotspot";
}


function renderExecutivePanel(payload) {
    const summary = payload.resumo_executivo || {};
    const insights = payload.insights_prioritarios || [];
    const recentSeries = payload.serie_historica_recente || [];

    refs.executiveTitle.textContent = `Cenário para ${formatDate(payload.data_previsao)}`;
    refs.executiveSummary.textContent =
        insights[0] ||
        `A previsão aponta ${formatDecimal(payload.previsao_total_yhat1)} eventos para a data selecionada.`;

    refs.riskPill.textContent = formatRisk(summary.nivel_risco);
    refs.riskPill.dataset.risk = summary.nivel_risco || "";

    if (recentSeries.length > 0) {
        refs.trendWindowLabel.textContent =
            `${formatDate(recentSeries[0].data)} até ${formatDate(recentSeries[recentSeries.length - 1].data)}`;
    } else {
        refs.trendWindowLabel.textContent = "Sem série recente";
    }

    renderTrendBars(recentSeries);
}


function renderInsights(insights) {
    refs.insightsList.innerHTML = "";

    if (!insights.length) {
        refs.insightsList.appendChild(createEmptyListItem("Nenhum insight prioritário foi retornado."));
        return;
    }

    insights.forEach((insight) => {
        const item = document.createElement("li");
        item.textContent = insight;
        refs.insightsList.appendChild(item);
    });
}


function renderTrendBars(series) {
    refs.trendBars.innerHTML = "";

    if (!series.length) {
        refs.trendBars.appendChild(createEmptyCard("Sem histórico recente para montar a tendência."));
        return;
    }

    const maxValue = Math.max(...series.map((item) => Number(item.total) || 0), 1);

    series.forEach((item) => {
        const wrapper = document.createElement("article");
        wrapper.className = "trend-bar";

        const value = document.createElement("span");
        value.className = "trend-bar-value";
        value.textContent = formatDecimal(item.total);

        const fill = document.createElement("div");
        fill.className = "trend-bar-fill";
        fill.style.height = `${Math.max((Number(item.total) / maxValue) * 100, 10)}%`;

        const label = document.createElement("span");
        label.className = "trend-bar-label";
        label.textContent = shortDateLabel(item.data);

        wrapper.append(value, fill, label);
        refs.trendBars.appendChild(wrapper);
    });
}


function renderPodium(drivers) {
    refs.podiumGrid.innerHTML = "";
    const podiumDrivers = drivers.slice(0, 3);

    if (!podiumDrivers.length) {
        refs.podiumGrid.appendChild(createEmptyCard("Nenhum motorista disponível para o pódio."));
        return;
    }

    podiumDrivers.forEach((driver, index) => {
        const card = document.createElement("article");
        card.className = "podium-card";

        const rank = document.createElement("span");
        rank.className = "podium-rank";
        rank.textContent = `#${index + 1}`;

        const name = document.createElement("strong");
        name.className = "podium-name";
        name.textContent = driver.Motorista;

        const value = document.createElement("span");
        value.className = "podium-value";
        value.textContent = formatPercent(driver.ParticipacaoPercentual);

        const support = document.createElement("span");
        support.className = "podium-support";
        support.textContent =
            `${formatDecimal(driver.EventosEsperados)} eventos esperados | ${formatCompact(driver.VolumeHistorico)} registros históricos`;

        card.append(rank, name, value, support);
        refs.podiumGrid.appendChild(card);
    });
}


function renderRankedStack(container, items, options) {
    container.innerHTML = "";

    if (!items.length) {
        container.appendChild(createEmptyCard("Não há dados suficientes para exibir esta lista."));
        return;
    }

    const maxPercent = Math.max(
        ...items.map((item) => Number(item.ParticipacaoPercentual || item.Probabilidade || 0)),
        1
    );

    items.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "stack-item";

        const header = document.createElement("div");
        header.className = "stack-item-header";

        const title = document.createElement("strong");
        title.className = "stack-item-title";
        title.textContent = `${index + 1}. ${item[options.labelKey]}`;

        const score = document.createElement("span");
        score.className = "stack-item-subtitle";
        score.textContent = formatPercent(item.ParticipacaoPercentual || item.Probabilidade);

        header.append(title, score);

        const subtitle = document.createElement("p");
        subtitle.className = "stack-item-subtitle";
        subtitle.textContent = options.subtitle(item);

        const progress = document.createElement("div");
        progress.className = "inline-progress";

        const progressFill = document.createElement("span");
        progressFill.style.width =
            `${Math.max(((item.ParticipacaoPercentual || item.Probabilidade || 0) / maxPercent) * 100, 8)}%`;
        progress.appendChild(progressFill);

        const footer = document.createElement("div");
        footer.className = "stack-item-footer";
        footer.textContent = `${formatCompact(item.VolumeHistorico)} ocorrências históricas consideradas`;

        card.append(header, subtitle, progress, footer);
        container.appendChild(card);
    });
}


function renderEventTypes(eventTypes) {
    refs.eventTypesBars.innerHTML = "";

    if (!eventTypes.length) {
        refs.eventTypesBars.appendChild(createEmptyCard("Nenhum tipo de evento foi retornado."));
        return;
    }

    const maxPercent = Math.max(
        ...eventTypes.map((item) => Number(item.ParticipacaoPercentual || 0)),
        1
    );

    eventTypes.forEach((eventType) => {
        const wrapper = document.createElement("article");
        wrapper.className = "bar-item";

        const header = document.createElement("div");
        header.className = "bar-item-header";

        const label = document.createElement("strong");
        label.className = "bar-item-label";
        label.textContent = eventType.TipoEvento;

        const score = document.createElement("span");
        score.className = "stack-item-subtitle";
        score.textContent = formatPercent(eventType.ParticipacaoPercentual);

        header.append(label, score);

        const track = document.createElement("div");
        track.className = "bar-track";

        const fill = document.createElement("span");
        fill.style.width = `${Math.max((eventType.ParticipacaoPercentual / maxPercent) * 100, 10)}%`;
        track.appendChild(fill);

        const meta = document.createElement("p");
        meta.className = "bar-item-meta";
        meta.textContent =
            `${formatDecimal(eventType.EventosEsperados)} eventos esperados | ${formatCompact(eventType.VolumeHistorico)} registros históricos`;

        wrapper.append(header, track, meta);
        refs.eventTypesBars.appendChild(wrapper);
    });
}


function renderEventBreakdown(eventGroups) {
    refs.eventBreakdownGrid.innerHTML = "";
    const entries = Object.entries(eventGroups);

    if (!entries.length) {
        refs.eventBreakdownGrid.appendChild(
            createEmptyCard("O backend não retornou detalhamento por tipo de evento.")
        );
        return;
    }

    entries.forEach(([eventName, drivers]) => {
        const card = document.createElement("article");
        card.className = "event-breakdown-card";

        const title = document.createElement("h4");
        title.textContent = eventName;
        card.appendChild(title);

        if (!drivers.length) {
            card.appendChild(createPlainText("Nenhum motorista disponível para este recorte."));
            refs.eventBreakdownGrid.appendChild(card);
            return;
        }

        const list = document.createElement("ul");
        list.className = "event-breakdown-list";

        drivers.forEach((driver) => {
            const item = document.createElement("li");

            const nameBlock = document.createElement("div");
            const name = document.createElement("strong");
            name.textContent = driver.Motorista;
            const history = document.createElement("span");
            history.textContent = `${formatCompact(driver.VolumeHistorico)} registros históricos`;
            nameBlock.append(name, history);

            const values = document.createElement("div");
            values.textContent =
                `${formatPercent(driver.ParticipacaoNoEventoPercentual || driver.Probabilidade)} | ${formatDecimal(driver.EventosEsperados)} esperados`;

            item.append(nameBlock, values);
            list.appendChild(item);
        });

        card.appendChild(list);
        refs.eventBreakdownGrid.appendChild(card);
    });
}


function renderUsersDirectory(users) {
    refs.usersDirectoryList.innerHTML = "";

    if (!users.length) {
        refs.adminPanel.classList.add("hidden");
        return;
    }

    refs.adminPanel.classList.remove("hidden");
    users.forEach((user) => {
        const permissions = Array.isArray(user.permissions) ? user.permissions.join(" | ") : "";
        const card = document.createElement("article");
        card.className = "stack-item";

        const header = document.createElement("div");
        header.className = "stack-item-header";

        const title = document.createElement("strong");
        title.className = "stack-item-title";
        title.textContent = `${user.name} (${user.role_title || user.role})`;

        const status = document.createElement("span");
        status.className = "stack-item-subtitle";
        status.textContent = user.active ? "Ativo" : "Inativo";

        const email = document.createElement("p");
        email.className = "stack-item-subtitle";
        email.textContent = user.email;

        const footer = document.createElement("div");
        footer.className = "stack-item-footer";
        footer.textContent = permissions || "Sem permissões cadastradas";

        header.append(title, status);
        card.append(header, email, footer);
        refs.usersDirectoryList.appendChild(card);
    });
}


function setLoading(isLoading) {
    refs.fetchDataButton.disabled = isLoading;
    refs.fetchDataButton.textContent = isLoading ? "Atualizando..." : "Atualizar painel";

    if (isLoading) {
        refs.loadingSection.classList.remove("hidden");
        refs.predictionResultsSection.classList.add("hidden");
    } else {
        refs.loadingSection.classList.add("hidden");
        if (state.prediction) {
            refs.predictionResultsSection.classList.remove("hidden");
        }
    }
}


function showAuthGate() {
    refs.authGate.classList.remove("hidden");
    refs.appShell.classList.add("hidden");
}


function showAppShell() {
    refs.authGate.classList.add("hidden");
    refs.appShell.classList.remove("hidden");
}


function setSystemStatus(message) {
    refs.systemStatusLabel.textContent = message;
}


function setLoginMessage(message, type) {
    refs.loginMessage.textContent = message;
    refs.loginMessage.classList.remove("is-error", "is-success");

    if (type === "error") {
        refs.loginMessage.classList.add("is-error");
    }
    if (type === "success") {
        refs.loginMessage.classList.add("is-success");
    }
}


function clearPredictionError() {
    refs.errorDisplaySection.classList.add("hidden");
    refs.errorMessage.textContent = "";
    refs.errorDetails.textContent = "";
}


function handlePredictionError(error) {
    const payload = error?.payload || null;
    const status = error?.status || null;

    let message = error?.message || "Não foi possível montar o painel preditivo.";
    let details = "Confira a conectividade com o backend ou escolha outra data.";

    if (payload?.error) {
        message = payload.error;
    }

    if (status === 404 && payload?.forecast_period_start && payload?.forecast_period_end) {
        details =
            `A data escolhida está fora da janela prevista. Use um intervalo entre ${formatDate(payload.forecast_period_start)} e ${formatDate(payload.forecast_period_end)}.`;
        refs.predictionDateInput.value = payload.forecast_period_start;
    } else if (status === 400) {
        details = "A API espera datas no formato YYYY-MM-DD.";
    } else if (payload?.forecast_period_start && payload?.forecast_period_end) {
        details =
            `Janela atual de previsão: ${formatDate(payload.forecast_period_start)} até ${formatDate(payload.forecast_period_end)}.`;
    } else if (payload?.requested_date) {
        details = `Data solicitada: ${payload.requested_date}.`;
    } else if (error?.details) {
        details = error.details;
    }

    refs.errorMessage.textContent = message;
    refs.errorDetails.textContent = details;
    refs.errorDisplaySection.classList.remove("hidden");
    refs.predictionResultsSection.classList.add("hidden");
    setSystemStatus("Falha ao sincronizar o painel");
}


function createEmptyListItem(message) {
    const item = document.createElement("li");
    item.textContent = message;
    return item;
}


function createEmptyCard(message) {
    const card = document.createElement("article");
    card.className = "stack-item";
    card.textContent = message;
    return card;
}


function createPlainText(message) {
    const text = document.createElement("p");
    text.className = "stack-item-subtitle";
    text.textContent = message;
    return text;
}


function resolveBackendUrl() {
    const queryApi = urlParams.get("api");
    if (queryApi) {
        return queryApi.replace(/\/$/, "");
    }

    if (window.location.protocol === "file:") {
        return FALLBACK_BACKEND_URL;
    }

    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
        return "http://127.0.0.1:5000";
    }

    return FALLBACK_BACKEND_URL;
}


function parseIsoDate(value) {
    if (!value) {
        return null;
    }

    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}


function addDays(dateValue, amount) {
    const date = new Date(dateValue);
    date.setDate(date.getDate() + amount);
    return date;
}


function formatDate(value) {
    const date = parseIsoDate(value);
    return date ? dateFormatter.format(date) : "Não informado";
}


function formatInputDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}


function shortDateLabel(value) {
    const date = parseIsoDate(value);
    if (!date) {
        return "--";
    }

    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}


function formatDecimal(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numberFormatter.format(numericValue) : "N/A";
}


function formatCompact(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? compactFormatter.format(numericValue) : "N/A";
}


function formatPercent(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? `${numberFormatter.format(numericValue)}%` : "N/A";
}


function formatSignedPercent(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return "N/A";
    }

    return `${numericValue > 0 ? "+" : ""}${numberFormatter.format(numericValue)}%`;
}


function formatRisk(level) {
    switch (level) {
        case "alto":
            return "Risco alto";
        case "moderado":
            return "Risco moderado";
        case "controlado":
            return "Risco controlado";
        default:
            return "Em análise";
    }
}
