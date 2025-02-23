// ======================================================
// Variáveis Globais e Estrutura de Dados
// ======================================================
let mockedCourseCode = "TURMA123";
const courseClasses = [
  { date: '2025-02-12', time: '14:00', label: 'Aula 1' },
  { date: '2025-02-13', time: '14:00', label: 'Aula 2' }
];

const sampleEvents = [
  { day: 5,  course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'P', time: '08:00' },
  { day: 10, course: 'Curso X',           color: '#ff5733', attendance: 'F', time: '10:00' },
  { day: 15, course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'P', time: '14:00' },
  { day: 15, course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'P', time: '16:00' },
  { day: 15, course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'F', time: '18:00' }
];

let currentYear, currentMonth;
let adminCalendarYear, adminCalendarMonth;

// ======================================================
// Funções de Utilidade e Navegação de Telas
// ======================================================
function switchScreen(hideIds = [], showId) {
  hideIds.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(showId).classList.remove('hidden');
}

function getMonthName(monthIndex) {
  const nomesMeses = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ];
  return nomesMeses[monthIndex];
}

// ======================================================
// Calendário do Aluno
// ======================================================
function initCalendar() {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  generateCalendar(currentYear, currentMonth);
}

function generateCalendar(year, month) {
  const calendarBody = document.getElementById('calendarBody');
  calendarBody.innerHTML = "";
  const table = document.createElement('table');

  // Cabeçalho
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(dia => {
    const th = document.createElement('th');
    th.textContent = dia;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Corpo
  const tbody = document.createElement('tbody');
  const primeiroDia = new Date(year, month, 1).getDay();
  const totalDias = new Date(year, month + 1, 0).getDate();

  let data = 1;
  for (let i = 0; i < 6; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
      const td = document.createElement('td');
      if ((i === 0 && j < primeiroDia) || data > totalDias) {
        td.textContent = "";
      } else {
        td.textContent = data;
        td.setAttribute('data-day', data);

        // Eventos desse dia
        const eventsForDay = sampleEvents.filter(e => e.day === data);
        if (eventsForDay.length) {
          eventsForDay.slice(0, 2).forEach(event => {
            const br = document.createElement('br');
            td.appendChild(br);
            const courseBadge = document.createElement('span');
            courseBadge.classList.add('course-badge');
            courseBadge.style.backgroundColor = event.color;
            courseBadge.textContent = event.course;
            td.appendChild(courseBadge);

            const attendanceBadge = document.createElement('span');
            attendanceBadge.classList.add(
              'attendance-badge',
              event.attendance === 'P' ? 'presence-badge' : 'absence-badge'
            );
            attendanceBadge.textContent = event.attendance;
            td.appendChild(attendanceBadge);
          });
          if (eventsForDay.length > 2) {
            const brExtra = document.createElement('br');
            td.appendChild(brExtra);
            const extraBadge = document.createElement('span');
            extraBadge.classList.add('extra-badge');
            extraBadge.textContent = `${eventsForDay.length - 2} mais`;
            td.appendChild(extraBadge);
          }
        }
        data++;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    if (data > totalDias) break;
  }
  table.appendChild(tbody);
  calendarBody.appendChild(table);

  document.getElementById('monthLabel').textContent = `${getMonthName(month)} ${year}`;
}

// Navegação do calendário do Aluno
document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  if (currentMonth === 11) currentYear--;
  generateCalendar(currentYear, currentMonth);
});
document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  if (currentMonth === 0) currentYear++;
  generateCalendar(currentYear, currentMonth);
});
document.getElementById('btnCurrentMonth').addEventListener('click', () => {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  generateCalendar(currentYear, currentMonth);
});

// Timeline “X mais”
document.getElementById('calendarBody').addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('extra-badge')) {
    const day = e.target.parentElement.getAttribute('data-day');
    showTimelineView(day);
  }
});

function showTimelineView(day) {
  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = "";
  document.getElementById('timelineDateLabel').textContent =
    `${day} ${getMonthName(currentMonth)} ${currentYear}`;

  sampleEvents
    .filter(e => e.day === parseInt(day))
    .forEach(ev => {
      const li = document.createElement('li');
      li.textContent = `${ev.time} - ${ev.course} - ${
        ev.attendance === 'P' ? "Presente" : "Falta"
      }`;
      li.style.borderLeft = `4px solid ${ev.color}`;
      li.style.paddingLeft = "8px";
      timelineList.appendChild(li);
    });

  document.querySelector('.calendar').style.display = 'none';
  document.getElementById('btnConfirmarPresencasMes').style.display = 'none';
  document.getElementById('timelineView').classList.remove('hidden');
}

document.getElementById('btnVoltarTimeline').addEventListener('click', () => {
  document.getElementById('timelineView').classList.add('hidden');
  document.querySelector('.calendar').style.display = '';
  document.getElementById('btnConfirmarPresencasMes').style.display = '';
});

// ======================================================
// Calendário do Operador (Admin)
// ======================================================
function initAdminCalendar() {
  const today = new Date();
  if (adminCalendarYear === undefined || adminCalendarMonth === undefined) {
    adminCalendarYear = today.getFullYear();
    adminCalendarMonth = today.getMonth();
  }
  document.getElementById('adminMonthLabel').textContent =
    `${getMonthName(adminCalendarMonth)} ${adminCalendarYear}`;

  const adminCalendarDiv = document.getElementById('adminCalendar');
  adminCalendarDiv.innerHTML = "";

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(dia => {
    const th = document.createElement('th');
    th.textContent = dia;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const firstDay = new Date(adminCalendarYear, adminCalendarMonth, 1).getDay();
  const totalDays = new Date(adminCalendarYear, adminCalendarMonth + 1, 0).getDate();

  let dateNum = 1;
  for (let i = 0; i < 6; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const td = document.createElement('td');
      if ((i === 0 && j < firstDay) || dateNum > totalDays) {
        td.textContent = "";
      } else {
        td.textContent = dateNum;

        const monthStr = (adminCalendarMonth + 1).toString().padStart(2,'0');
        const dayStr = dateNum.toString().padStart(2,'0');
        const dateStr = `${adminCalendarYear}-${monthStr}-${dayStr}`;

        // Dia atual
        const currentDate = new Date();
        const currentStr = `${currentDate.getFullYear()}-${
          (currentDate.getMonth()+1).toString().padStart(2,'0')
        }-${
          currentDate.getDate().toString().padStart(2,'0')
        }`;
        if (dateStr === currentStr) {
          td.classList.add('today');
        }

        // Verifica se há aula
        const classData = courseClasses.find(c => c.date === dateStr);
        if (classData) {
          const marker = document.createElement('div');
          marker.textContent = classData.label;
          marker.style.background = "#0052cc";
          marker.style.color = "#fff";
          marker.style.padding = "2px 4px";
          marker.style.borderRadius = "4px";
          marker.style.marginTop = "4px";
          td.appendChild(marker);

          td.style.cursor = "pointer";
          td.addEventListener('click', () => openAdminClassSheet(classData));
        }
        dateNum++;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    if (dateNum > totalDays) break;
  }
  table.appendChild(tbody);
  adminCalendarDiv.appendChild(table);
}

// Navegação do calendário Admin
document.getElementById('adminPrevMonth').addEventListener('click', () => {
  adminCalendarMonth = adminCalendarMonth === 0 ? 11 : adminCalendarMonth - 1;
  if (adminCalendarMonth === 11) adminCalendarYear--;
  initAdminCalendar();
});
document.getElementById('adminNextMonth').addEventListener('click', () => {
  adminCalendarMonth = adminCalendarMonth === 11 ? 0 : adminCalendarMonth + 1;
  if (adminCalendarMonth === 0) adminCalendarYear++;
  initAdminCalendar();
});
document.getElementById('adminCurrentMonth').addEventListener('click', () => {
  const today = new Date();
  adminCalendarYear = today.getFullYear();
  adminCalendarMonth = today.getMonth();
  initAdminCalendar();
});

// ======================================================
// Sheet do Operador (QR Code)
// ======================================================
function openAdminClassSheet(classData) {
  window.selectedSheetClass = classData;
  document.getElementById('sheetClassLabel').textContent = classData.label;
  document.getElementById('sheetClassDateTime').textContent =
    `Data: ${classData.date} - Horário: ${classData.time}`;

  if (canGenerateQRCode(classData)) {
    generateSheetQRCode(classData);
  } else {
    document.getElementById('sheetQRCodeContainer').innerHTML =
      "<p>Horário para gerar QR Code indisponível</p>";
  }
  document.getElementById('adminClassSheet').classList.add('active');
}

function generateSheetQRCode(classData) {
  const sheetQRCodeContainer = document.getElementById('sheetQRCodeContainer');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent("QR Code " + classData.label)}&size=200x200`;
  sheetQRCodeContainer.innerHTML = `
    <img
      id="sheetQRCodeImage"
      src="${qrCodeUrl}"
      alt="QR Code"
      class="qr-code"
    />
    <p id="sheetQRCountdown" class="countdown">Tempo restante: 60s</p>
  `;
  if (window.sheetQrTimer) clearTimeout(window.sheetQrTimer);
  if (window.sheetQrTimerInterval) clearInterval(window.sheetQrTimerInterval);

  let secondsLeft = 60;
  const countdownElem = document.getElementById('sheetQRCountdown');
  window.sheetQrTimerInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft > 0) {
      countdownElem.textContent = `Tempo restante: ${secondsLeft}s`;
    } else {
      countdownElem.textContent = "";
      clearInterval(window.sheetQrTimerInterval);
    }
  }, 1000);

  window.sheetQrTimer = setTimeout(() => {
    sheetQRCodeContainer.innerHTML = "<p style='color:red; font-weight:bold;'>QR Code Expirado</p>";
  }, 60000);
}

function canGenerateQRCode(classData) {
  const classStart = new Date(`${classData.date}T${classData.time}:00`);
  const now = new Date();
  const windowStart = new Date(classStart.getTime() - 15*60*1000);
  const windowEnd = new Date(classStart.getTime() + 15*60*1000);
  return now >= windowStart && now <= windowEnd;
}

document.getElementById('closeSheet').addEventListener('click', () => {
  document.getElementById('adminClassSheet').classList.remove('active');
});

document.getElementById('sheetRegenerateQRCode').addEventListener('click', () => {
  if (window.selectedSheetClass) {
    generateSheetQRCode(window.selectedSheetClass);
  }
});

// ======================================================
// Funcionalidades do App Aluno e Painel Administrativo
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  // Alternância entre App Aluno e Painel Operador
  const tabAluno = document.getElementById('tabAluno');
  const tabOperador = document.getElementById('tabOperador');
  const appAlunoSection = document.getElementById('appAluno');
  const painelOperadorSection = document.getElementById('painelOperador');

  tabAluno.addEventListener('click', () => {
    tabAluno.classList.add('active');
    tabOperador.classList.remove('active');
    appAlunoSection.classList.remove('hidden');
    painelOperadorSection.classList.add('hidden');
  });

  tabOperador.addEventListener('click', () => {
    tabOperador.classList.add('active');
    tabAluno.classList.remove('active');
    painelOperadorSection.classList.remove('hidden');
    appAlunoSection.classList.add('hidden');
  });

  // ========================
  // Fluxo do App Aluno
  // ========================
  document.getElementById('btnLoginAluno').addEventListener('click', () => {
    switchScreen(['alunoLoginScreen'], 'alunoDashboardScreen');
  });

  document.getElementById('btnVerCalendario').addEventListener('click', () => {
    switchScreen(['alunoDashboardScreen'], 'alunoCalendarioScreen');
    initCalendar();
  });

  document.getElementById('btnVoltarCalendario').addEventListener('click', () => {
    switchScreen(['alunoCalendarioScreen'], 'alunoDashboardScreen');
  });

  document.getElementById('listaAulas').addEventListener('click', (e) => {
    if (e.target && e.target.matches('.btnDetalhes')) {
      const aulaId = e.target.closest('li').getAttribute('data-aula-id');
      document.getElementById('detalhesInfo').textContent =
        `Detalhes da Aula ${aulaId}: Data, horário e infos.`;
      switchScreen(['alunoDashboardScreen'], 'alunoDetalhesScreen');
    }
  });

  document.getElementById('btnConfirmarPresenca').addEventListener('click', () => {
    switchScreen(['alunoDetalhesScreen'], 'alunoQRCodeScreen');
  });

  document.getElementById('btnSimularQRScan').addEventListener('click', () => {
    switchScreen(['alunoQRCodeScreen'], 'alunoFeedbackScreen');
  });

  document.getElementById('btnVoltarDetalhesQRCode').addEventListener('click', () => {
    switchScreen(['alunoQRCodeScreen'], 'alunoDetalhesScreen');
  });

  document.getElementById('btnVoltarDashboard').addEventListener('click', () => {
    switchScreen(['alunoDetalhesScreen'], 'alunoDashboardScreen');
  });

  document.getElementById('btnFecharFeedback').addEventListener('click', () => {
    switchScreen(['alunoFeedbackScreen'], 'alunoDashboardScreen');
  });

  document.getElementById('btnInserirCodigoCurso').addEventListener('click', () => {
    switchScreen(['alunoDashboardScreen'], 'alunoCodigoCursoScreen');
  });

  document.getElementById('btnVoltarDashboardCodigo').addEventListener('click', () => {
    switchScreen(['alunoCodigoCursoScreen'], 'alunoDashboardScreen');
  });

  document.getElementById('btnEntrarCurso').addEventListener('click', () => {
    const codigo = document.getElementById('codigoCurso').value.trim();
    if (!codigo) {
      alert("Por favor, insira um código válido.");
      return;
    }
    if (codigo === mockedCourseCode) {
      alert("Você entrou no curso com sucesso!");
      document.getElementById('codigoCurso').value = "";
      switchScreen(['alunoCodigoCursoScreen'], 'alunoDashboardScreen');
    } else {
      alert("Código inválido. Verifique o código e tente novamente.");
    }
  });

  // Aluno: Sheet de confirmação de presenças mensais
  function calcularResumoPresencas() {
    const resumo = {};
    sampleEvents.forEach(evento => {
      if (!resumo[evento.course]) {
        resumo[evento.course] = { presencas: 0, faltas: 0 };
      }
      if (evento.attendance === 'P') {
        resumo[evento.course].presencas++;
      } else {
        resumo[evento.course].faltas++;
      }
    });
    return resumo;
  }

  function mostrarResumoNaSheet() {
    const resumo = calcularResumoPresencas();
    const resumoDiv = document.getElementById('resumoPresencas');
    resumoDiv.innerHTML = "";
    for (let curso in resumo) {
      const { presencas, faltas } = resumo[curso];
      const p = document.createElement('p');
      p.textContent = `${curso} – Presenças: ${presencas} | Faltas: ${faltas}`;
      resumoDiv.appendChild(p);
    }
  }

  document.getElementById('btnConfirmarPresencasMes').addEventListener('click', () => {
    mostrarResumoNaSheet();
    document.getElementById('alunoConfirmSheet').classList.add('active');
  });

  document.getElementById('closeAlunoSheet').addEventListener('click', () => {
    document.getElementById('alunoConfirmSheet').classList.remove('active');
  });

  document.getElementById('btnAssinarGov').addEventListener('click', function() {
    this.style.backgroundColor = "#28a745";
    this.textContent = "Assinado";
    this.disabled = true;
    const btnConfirmar = document.getElementById('btnConfirmarPresencasMes');
    btnConfirmar.style.backgroundColor = "#28a745";
    btnConfirmar.disabled = true;
  });

  // ========================
  // Fluxo do Painel Operador
  // ========================
  document.getElementById('btnLoginOperador').addEventListener('click', () => {
    const user = document.getElementById('usuarioOperador').value;
    const pass = document.getElementById('senhaOperador').value;
    if (!user || !pass) {
      alert("Preencha usuário e senha.");
      return;
    }
    switchScreen(['operadorLoginForm'], 'operadorDashboard');
  });

  document.getElementById('btnVerCursos').addEventListener('click', () => {
    switchScreen(['operadorDashboard'], 'operadorCursos');
  });

  document.getElementById('btnVoltarDashboardOperador1').addEventListener('click', () => {
    switchScreen(['operadorCursos'], 'operadorDashboard');
  });

  document.getElementById('adminHamburger').addEventListener('click', () => {
    document.getElementById('adminSidebarMenu').classList.add('active');
    document.getElementById('adminSidebarOverlay').classList.add('active');
  });

  document.getElementById('closeSidebar').addEventListener('click', () => {
    document.getElementById('adminSidebarMenu').classList.remove('active');
    document.getElementById('adminSidebarOverlay').classList.remove('active');
  });

  document.getElementById('adminSidebarOverlay').addEventListener('click', () => {
    document.getElementById('adminSidebarMenu').classList.remove('active');
    document.getElementById('adminSidebarOverlay').classList.remove('active');
  });

  document.getElementById('linkCurso1').addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen(['operadorDashboard'], 'operadorDashboardCurso');
    document.getElementById('courseCodeDisplay').textContent = mockedCourseCode;
    document.getElementById('adminSidebarMenu').classList.remove('active');
    document.getElementById('adminSidebarOverlay').classList.remove('active');
  });

  document.getElementById('linkCurso2').addEventListener('click', (e) => {
    e.preventDefault();
    switchScreen(['operadorDashboard'], 'operadorDashboardCurso');
    document.getElementById('courseCodeDisplay').textContent = "CURSOX456";
    document.getElementById('adminSidebarMenu').classList.remove('active');
    document.getElementById('adminSidebarOverlay').classList.remove('active');
  });

  document.getElementById('btnVoltarDashboardCurso').addEventListener('click', () => {
    switchScreen(['operadorDashboardCurso'], 'operadorDashboard');
  });

  document.getElementById('tabRegistroChamada').addEventListener('click', () => {
    document.getElementById('tabRegistroChamada').classList.add('active');
    document.getElementById('tabDiarioCurso').classList.remove('active');
    document.getElementById('contentRegistroChamada').classList.remove('hidden');
    document.getElementById('contentDiarioCurso').classList.add('hidden');
    initAdminCalendar();
  });

  document.getElementById('tabDiarioCurso').addEventListener('click', () => {
    document.getElementById('tabDiarioCurso').classList.add('active');
    document.getElementById('tabRegistroChamada').classList.remove('active');
    document.getElementById('contentDiarioCurso').classList.remove('hidden');
    document.getElementById('contentRegistroChamada').classList.add('hidden');
  });

  document.getElementById('btnCadastrarAluno').addEventListener('click', () => {
    switchScreen(['operadorDashboard','operadorCursos','operadorDashboardCurso'], 'operadorCadastrarAluno');
  });

  document.getElementById('btnVoltarDashboardAluno').addEventListener('click', () => {
    switchScreen(['operadorCadastrarAluno'], 'operadorDashboard');
  });

  document.getElementById('formCadastrarAluno').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeAluno').value;
    alert(`Aluno ${nome} cadastrado com sucesso!`);
    e.target.reset();
    switchScreen(['operadorCadastrarAluno'], 'operadorDashboard');
  });
});

// ======================================================
// Cálculo da Carga Horária no Gerenciamento de Cursos
// ======================================================
function updateCargaHoraria() {
  const diaCards = document.querySelectorAll('#operadorCursos .dia-card');
  const activeDays = [];
  const mapping = {
    'Dom': 0, 'Seg': 1, 'Ter': 2,
    'Qua': 3, 'Qui': 4, 'Sex': 5, 'Sáb': 6
  };

  diaCards.forEach(card => {
    if (card.classList.contains('active')) {
      const diaAbreviado = card.getAttribute('data-dia');
      if (mapping.hasOwnProperty(diaAbreviado)) {
        activeDays.push(mapping[diaAbreviado]);
      }
    }
  });

  const horasPorAula = parseFloat(document.getElementById('horasPorAula').value) || 0;
  const dataInicioStr = document.getElementById('dataInicio').value;
  const dataFimStr = document.getElementById('dataFim').value;
  let totalClasses = 0;

  if (dataInicioStr && dataFimStr) {
    const dataInicio = new Date(dataInicioStr);
    const dataFim = new Date(dataFimStr);
    for (let d = new Date(dataInicio); d <= dataFim; d.setDate(d.getDate() + 1)) {
      if (activeDays.includes(d.getDay())) totalClasses++;
    }
  }
  const cargaTotal = totalClasses * horasPorAula;
  document.getElementById('cargaHorariaTotal').value = `${cargaTotal}h`;
}

function salvarCurso() {
  // Aqui você pode integrar com backend, gerar código dinâmico etc.
  mockedCourseCode = "TURMA123";
  alert(`Curso salvo com sucesso!\nCódigo do curso gerado: ${mockedCourseCode}`);
}

// Marcar/destacar dias ao clicar
document.addEventListener('DOMContentLoaded', () => {
  const diaCards = document.querySelectorAll('#operadorCursos .dia-card');
  diaCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
      updateCargaHoraria();
    });
  });
  updateCargaHoraria();
});
