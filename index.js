
let mockedCourseCode = "TURMA123";

const courseClasses = [
  { date: '2025-02-12', time: '14:00', label: 'Aula 1' },
  { date: '2025-02-13', time: '14:00', label: 'Aula 2' }
];

const sampleEvents = [
  { day: 5, course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'P', time: '08:00' },
  { day: 10, course: 'Curso X', color: '#ff5733', attendance: 'F', time: '10:00' },
  { day: 15, course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'P', time: '14:00' },
  { day: 15, course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'P', time: '16:00' },
  { day: 15, course: 'Cabeleireiro 240h', color: '#0052cc', attendance: 'F', time: '18:00' }
];

let currentYear, currentMonth;

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
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(dia => {
    const th = document.createElement('th');
    th.textContent = dia;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

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
        const eventsForDay = sampleEvents.filter(e => e.day === data);

        if (eventsForDay.length) {
          const displayEvents = eventsForDay.slice(0, 2);

          displayEvents.forEach(event => {
            const br = document.createElement('br');
            td.appendChild(br);
            const courseBadge = document.createElement('span');
            courseBadge.classList.add('course-badge');
            courseBadge.style.backgroundColor = event.color;
            courseBadge.textContent = event.course;
            td.appendChild(courseBadge);
            const attendanceBadge = document.createElement('span');
            attendanceBadge.classList.add('attendance-badge');
            attendanceBadge.classList.add(event.attendance === 'P' ? 'presence-badge' : 'absence-badge');
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
  const monthLabel = document.getElementById('monthLabel');
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  monthLabel.textContent = nomesMeses[month] + ' ' + year;
}

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

document.getElementById('calendarBody').addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('extra-badge')) {
    const day = e.target.parentElement.getAttribute('data-day');
    showTimelineView(day);
  }
});

function showTimelineView(day) {
  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = "";
  const timelineDateLabel = document.getElementById('timelineDateLabel');
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  timelineDateLabel.textContent = day + " " + nomesMeses[currentMonth] + " " + currentYear;
  const events = sampleEvents.filter(e => e.day === parseInt(day));

  events.forEach(ev => {
    const li = document.createElement('li');
    li.textContent = ev.time + " - " + ev.course + " - " + (ev.attendance === 'P' ? "Presente" : "Falta");
    li.style.borderLeft = "4px solid " + ev.color;
    li.style.paddingLeft = "8px";
    timelineList.appendChild(li);
  });

  // Oculta o calendário e o botão de Confirmar Presenças do Mês usando display 'none'
  document.querySelector('.calendar').style.display = 'none';
  document.getElementById('btnConfirmarPresencasMes').style.display = 'none';
  document.getElementById('timelineView').classList.remove('hidden');
}

document.getElementById('btnVoltarTimeline').addEventListener('click', () => {
  document.getElementById('timelineView').classList.add('hidden');
  // Exibe novamente o calendário e o botão de Confirmar Presenças do Mês
  document.querySelector('.calendar').style.display = '';
  document.getElementById('btnConfirmarPresencasMes').style.display = '';
});


let adminCalendarYear, adminCalendarMonth;

function initAdminCalendar() {
  const today = new Date();
  if (adminCalendarYear === undefined || adminCalendarMonth === undefined) {
    adminCalendarYear = today.getFullYear();
    adminCalendarMonth = today.getMonth();
  }
  const adminMonthLabel = document.getElementById('adminMonthLabel');
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  adminMonthLabel.textContent = nomesMeses[adminCalendarMonth] + ' ' + adminCalendarYear;

  const adminCalendarDiv = document.getElementById('adminCalendar');
  adminCalendarDiv.innerHTML = "";

  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let headerRow = document.createElement('tr');

  ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(dia => {
    let th = document.createElement('th');
    th.textContent = dia;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  let tbody = document.createElement('tbody');
  let firstDay = new Date(adminCalendarYear, adminCalendarMonth, 1).getDay();
  let totalDays = new Date(adminCalendarYear, adminCalendarMonth + 1, 0).getDate();
  let dateNum = 1;

  for (let i = 0; i < 6; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      let td = document.createElement('td');
      if ((i === 0 && j < firstDay) || dateNum > totalDays) {
        td.textContent = "";
      } else {
        td.textContent = dateNum;
        let monthStr = (adminCalendarMonth + 1).toString().padStart(2, '0');
        let dayStr = dateNum.toString().padStart(2, '0');
        let dateStr = `${adminCalendarYear}-${monthStr}-${dayStr}`;
        const currentDate = new Date();
        const currentStr = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

        if (dateStr === currentStr) {
          td.classList.add('today');
        }

        let classData = courseClasses.find(c => c.date === dateStr);
        if (classData) {
          let marker = document.createElement('div');
          marker.textContent = classData.label;
          marker.style.background = "#0052cc";
          marker.style.color = "#fff";
          marker.style.padding = "2px 4px";
          marker.style.borderRadius = "4px";
          marker.style.marginTop = "4px";
          td.appendChild(marker);
          td.style.cursor = "pointer";
          // Ao clicar na célula, abre a view do tipo sheet com as informações da aula
          td.addEventListener('click', function() {
            openAdminClassSheet(classData);
          });
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

function openAdminClassSheet(classData) {
  window.selectedSheetClass = classData;

  document.getElementById('sheetClassLabel').textContent = classData.label;
  document.getElementById('sheetClassDateTime').textContent = `Data: ${classData.date} - Horário: ${classData.time}`;
  if (canGenerateQRCode(classData)) {
    generateSheetQRCode(classData);
  } else {
    document.getElementById('sheetQRCodeContainer').innerHTML = `<p>Horário para gerar QR Code indisponível</p>`;
  }
  document.getElementById('adminClassSheet').classList.remove('hidden');
  document.getElementById('adminClassSheet').classList.add('active');
}

function generateSheetQRCode(classData) {
  const sheetQRCodeContainer = document.getElementById('sheetQRCodeContainer');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent("QR Code " + classData.label)}&size=200x200`;
  sheetQRCodeContainer.innerHTML =
    `<img id="sheetQRCodeImage" src="${qrCodeUrl}" alt="QR Code" style="width:200px; height:200px; margin-bottom: 1em;" />
    <p id="sheetQRCountdown" style="font-weight:bold;">Tempo restante: 60s</p>`;
  if (window.sheetQrTimer) { clearTimeout(window.sheetQrTimer); }
  if (window.sheetQrTimerInterval) { clearInterval(window.sheetQrTimerInterval); }

  let secondsLeft = 60;
  const countdownElem = document.getElementById('sheetQRCountdown');

  window.sheetQrTimerInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft > 0) {
      countdownElem.textContent = "Tempo restante: " + secondsLeft + "s";
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
  let classStart = new Date(`${classData.date}T${classData.time}:00`);
  let now = new Date();
  let windowStart = new Date(classStart.getTime() - 15 * 60 * 1000);
  let windowEnd = new Date(classStart.getTime() + 15 * 60 * 1000);
  return now >= windowStart && now <= windowEnd;
}

document.getElementById('closeSheet').addEventListener('click', () => {
  document.getElementById('adminClassSheet').classList.remove('active');
  setTimeout(() => {
    document.getElementById('adminClassSheet').classList.add('hidden');
  }, 300);
});

document.getElementById('sheetRegenerateQRCode').addEventListener('click', () => {
  if (window.selectedSheetClass) {
    generateSheetQRCode(window.selectedSheetClass);
  }
});

// Funções para o App Aluno
document.addEventListener('DOMContentLoaded', () => {
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

  const alunoLoginScreen = document.getElementById('alunoLoginScreen');
  const alunoDashboardScreen = document.getElementById('alunoDashboardScreen');
  const alunoDetalhesScreen = document.getElementById('alunoDetalhesScreen');
  const alunoFeedbackScreen = document.getElementById('alunoFeedbackScreen');
  const alunoCalendarioScreen = document.getElementById('alunoCalendarioScreen');
  const alunoCodigoCursoScreen = document.getElementById('alunoCodigoCursoScreen');
  const alunoQRCodeScreen = document.getElementById('alunoQRCodeScreen');

  document.getElementById('btnLoginAluno').addEventListener('click', () => {
    alunoLoginScreen.classList.add('hidden');
    alunoDashboardScreen.classList.remove('hidden');
  });

  document.getElementById('btnVerCalendario').addEventListener('click', () => {
    alunoDashboardScreen.classList.add('hidden');
    alunoCalendarioScreen.classList.remove('hidden');
    initCalendar();
  });

  document.getElementById('btnVoltarCalendario').addEventListener('click', () => {
    alunoCalendarioScreen.classList.add('hidden');
    alunoDashboardScreen.classList.remove('hidden');
  });

  document.getElementById('listaAulas').addEventListener('click', (e) => {
    if (e.target && e.target.matches('.btnDetalhes')) {
      const aulaId = e.target.closest('li').getAttribute('data-aula-id');
      document.getElementById('detalhesInfo').textContent = `Detalhes da Aula ${aulaId}: Data, horário e informações do curso.`;
      alunoDashboardScreen.classList.add('hidden');
      alunoDetalhesScreen.classList.remove('hidden');
    }
  });

  document.getElementById('btnConfirmarPresenca').addEventListener('click', () => {
    alunoDetalhesScreen.classList.add('hidden');
    alunoQRCodeScreen.classList.remove('hidden');
  });

  document.getElementById('btnSimularQRScan').addEventListener('click', () => {
    alunoQRCodeScreen.classList.add('hidden');
    alunoFeedbackScreen.classList.remove('hidden');
  });

  document.getElementById('btnVoltarDetalhesQRCode').addEventListener('click', () => {
    alunoQRCodeScreen.classList.add('hidden');
    alunoDetalhesScreen.classList.remove('hidden');
  });

  document.getElementById('btnVoltarDashboard').addEventListener('click', () => {
    alunoDetalhesScreen.classList.add('hidden');
    alunoDashboardScreen.classList.remove('hidden');
  });

  document.getElementById('btnFecharFeedback').addEventListener('click', () => {
    alunoFeedbackScreen.classList.add('hidden');
    alunoDashboardScreen.classList.remove('hidden');
  });

  document.getElementById('btnInserirCodigoCurso').addEventListener('click', () => {
    alunoDashboardScreen.classList.add('hidden');
    alunoCodigoCursoScreen.classList.remove('hidden');
  });

  document.getElementById('btnVoltarDashboardCodigo').addEventListener('click', () => {
    alunoCodigoCursoScreen.classList.add('hidden');
    alunoDashboardScreen.classList.remove('hidden');
  });

  document.getElementById('btnEntrarCurso').addEventListener('click', () => {
    const codigo = document.getElementById('codigoCurso').value.trim();
    if (!codigo) {
      alert("Por favor, insira um código válido.");
    } else if (codigo === mockedCourseCode) {
      alert("Você entrou no curso com sucesso!");
      document.getElementById('codigoCurso').value = "";
      alunoCodigoCursoScreen.classList.add('hidden');
      alunoDashboardScreen.classList.remove('hidden');
    } else {
      alert("Código inválido. Verifique o código e tente novamente.");
    }
  });

  // Funcionalidades do Painel Administrativo
  const operadorDashboard = document.getElementById('operadorDashboard');
  const operadorCursos = document.getElementById('operadorCursos');
  const operadorDashboardCurso = document.getElementById('operadorDashboardCurso');

  document.getElementById('btnLoginOperador').addEventListener('click', () => {
    document.getElementById('operadorLoginForm').classList.add('hidden');
    operadorDashboard.classList.remove('hidden');
  });

  document.getElementById('btnVerCursos').addEventListener('click', () => {
    operadorDashboard.classList.add('hidden');
    operadorCursos.classList.remove('hidden');
  });

  document.getElementById('btnVoltarDashboardOperador1').addEventListener('click', () => {
    operadorCursos.classList.add('hidden');
    operadorDashboard.classList.remove('hidden');
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
    operadorDashboard.classList.add('hidden');
    operadorDashboardCurso.classList.remove('hidden');
    document.getElementById('courseCodeDisplay').textContent = mockedCourseCode;
    document.getElementById('adminSidebarMenu').classList.remove('active');
    document.getElementById('adminSidebarOverlay').classList.remove('active');
  });

  document.getElementById('linkCurso2').addEventListener('click', (e) => {
    e.preventDefault();
    operadorDashboard.classList.add('hidden');
    operadorDashboardCurso.classList.remove('hidden');
    document.getElementById('courseCodeDisplay').textContent = "CURSOX456";
    document.getElementById('adminSidebarMenu').classList.remove('active');
    document.getElementById('adminSidebarOverlay').classList.remove('active');
  });

  document.getElementById('btnVoltarDashboardCurso').addEventListener('click', () => {
    operadorDashboardCurso.classList.add('hidden');
    operadorDashboard.classList.remove('hidden');
  });

  const tabRegistroChamada = document.getElementById('tabRegistroChamada');
  const tabDiarioCurso = document.getElementById('tabDiarioCurso');
  const contentRegistroChamada = document.getElementById('contentRegistroChamada');
  const contentDiarioCurso = document.getElementById('contentDiarioCurso');

  tabRegistroChamada.addEventListener('click', () => {
    tabRegistroChamada.classList.add('active');
    tabDiarioCurso.classList.remove('active');
    contentRegistroChamada.classList.remove('hidden');
    contentDiarioCurso.classList.add('hidden');
    initAdminCalendar();
  });

  tabDiarioCurso.addEventListener('click', () => {
    tabDiarioCurso.classList.add('active');
    tabRegistroChamada.classList.remove('active');
    contentDiarioCurso.classList.remove('hidden');
    contentRegistroChamada.classList.add('hidden');
  });

  // Funcionalidades da nova sheet para confirmação de presenças no App Aluno

  // Função para calcular o total de presenças e faltas por curso (exemplo usando sampleEvents)
  function calcularResumoPresencas() {
    const resumo = {}; // { 'Curso': { presencas: x, faltas: y } }
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

  // Exibe o resumo na sheet
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

  // Abre a sheet de confirmação de presenças
  document.getElementById('btnConfirmarPresencasMes').addEventListener('click', () => {
    mostrarResumoNaSheet();
    const sheet = document.getElementById('alunoConfirmSheet');
    sheet.classList.remove('hidden');
    setTimeout(() => {
      sheet.classList.add('active');
    }, 10);
  });

  // Fecha a sheet quando o usuário clicar no "x"
  document.getElementById('closeAlunoSheet').addEventListener('click', () => {
    const sheet = document.getElementById('alunoConfirmSheet');
    sheet.classList.remove('active');
    setTimeout(() => {
      sheet.classList.add('hidden');
    }, 300);
  });

  // Ação do botão de assinatura usando gov.br
  document.getElementById('btnAssinarGov').addEventListener('click', function() {
    // Integração com gov.br (aqui demonstrada com mudança visual)
    this.style.backgroundColor = "#28a745";
    this.textContent = "Assinado";
    this.disabled = true;
    // Opcional: também desabilitar o botão de confirmação
    document.getElementById('btnConfirmarPresencasMes').style.backgroundColor = "#28a745";
    document.getElementById('btnConfirmarPresencasMes').disabled = true;
  });
});

function updateCargaHoraria() {
  const diaCards = document.querySelectorAll('#operadorCursos .dia-card');
  const activeDays = [];
  const mapping = { 'Dom': 0, 'Seg': 1, 'Ter': 2, 'Qua': 3, 'Qui': 4, 'Sex': 5, 'Sáb': 6 };
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
      if (activeDays.includes(d.getDay())) {
        totalClasses++;
      }
    }
  }

  const cargaTotal = totalClasses * horasPorAula;
  document.getElementById('cargaHorariaTotal').value = cargaTotal + "h";
}

function salvarCurso() {
  mockedCourseCode = "TURMA123";
  alert("Curso salvo com sucesso!\nCódigo do curso gerado: " + mockedCourseCode);
}

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
