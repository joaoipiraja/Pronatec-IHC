import asyncio
from pyppeteer import launch
from pyppeteer.errors import TimeoutError

async def screenshot_element(page, selector, filename):
    """
    Aguarda o seletor estar visível e tira uma screenshot apenas do elemento.
    """
    try:
        await page.waitForSelector(f"{selector}:not(.hidden)", {'visible': True, 'timeout': 10000})
        element = await page.querySelector(selector)
        if element:
            await element.screenshot({'path': filename})
            print(f"Screenshot salvo: {filename}")
        else:
            print(f"Elemento não encontrado para screenshot: {selector}")
    except TimeoutError:
        print(f"Timeout ao esperar pelo seletor para screenshot: {selector}")

async def wait_and_click(page, selector, delay=0.5, timeout=10000):
    """
    Aguarda o seletor estar visível, rola até ele, aguarda um delay e clica.
    """
    try:
        await page.waitForSelector(selector, {'visible': True, 'timeout': timeout})
        await page.hover(selector)
        await asyncio.sleep(delay)
        await page.click(selector)
        print(f"Clique realizado no elemento: {selector}")
    except TimeoutError:
        print(f"Timeout ao esperar pelo seletor para clique: {selector}")
        raise

async def main():
    browser = await launch(headless=True, args=['--no-sandbox'])
    page = await browser.newPage()

    # Define um viewport padrão para a aplicação
    await page.setViewport({'width': 1280, 'height': 800})

    # Carrega a aplicação local – ajuste o caminho conforme necessário
    await page.goto('file:///Users/joaovictoripirajadealencar/Downloads/IHC/Presenca-Pronatec-IHC/index.html')
    await page.waitForSelector('header', {'visible': True})

    # Fluxo 1: Tela de Login do Aluno
    await screenshot_element(page, '#alunoLoginScreen', 'aluno_login.png')

    # Fluxo 2: Dashboard do Aluno
    try:
        await wait_and_click(page, '#btnLoginAluno')
        await page.waitForSelector('#alunoDashboardScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#alunoDashboardScreen', 'aluno_dashboard.png')
    except TimeoutError:
        print("Fluxo do Dashboard do Aluno não pôde ser completado.")

    # Fluxo 3: Calendário do Aluno (tela inteira)
    try:
        await wait_and_click(page, '#btnVerCalendario')
        await page.waitForSelector('#alunoCalendarioScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
        # Limita o tamanho da janela para 1024x768 antes da captura
        await page.setViewport({'width': 1024, 'height': 768})
        # Captura a screenshot da página inteira
        await page.screenshot({'path': 'aluno_calendario.png', 'fullPage': True})
        print("Screenshot salvo (tela inteira) em: aluno_calendario.png")
        # Volta para o Dashboard do Aluno (supondo que haja o botão "Voltar")
        await wait_and_click(page, '#btnVoltarCalendario')
        await page.waitForSelector('#alunoDashboardScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
    except TimeoutError:
        print("Fluxo do Calendário do Aluno não pôde ser completado.")

    # Fluxo 4: Detalhes da Aula
    try:
        await asyncio.sleep(1)
        await wait_and_click(page, '#listaAulas li:nth-child(1) .btnDetalhes')
        await page.waitForSelector('#alunoDetalhesScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#alunoDetalhesScreen', 'aluno_detalhes_aula.png')
    except TimeoutError:
        print("Fluxo de Detalhes da Aula não pôde ser completado.")

    # Fluxo 5: Tela de QR Code (após confirmar presença)
    try:
        await wait_and_click(page, '#btnConfirmarPresenca')
        await page.waitForSelector('#alunoQRCodeScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#alunoQRCodeScreen', 'aluno_qrcode.png')
    except TimeoutError:
        print("Fluxo de QR Code não pôde ser completado.")

    # Fluxo 6: Feedback de Presença
    try:
        await wait_and_click(page, '#btnSimularQRScan')
        await page.waitForSelector('#alunoFeedbackScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#alunoFeedbackScreen', 'aluno_feedback.png')
        await wait_and_click(page, '#btnFecharFeedback')
        await page.waitForSelector('#alunoDashboardScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
    except TimeoutError:
        print("Fluxo de Feedback de Presença não pôde ser completado.")

    # Fluxo 7: Tela de Inserir Código do Curso
    try:
        await wait_and_click(page, '#btnInserirCodigoCurso')
        await page.waitForSelector('#alunoCodigoCursoScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#alunoCodigoCursoScreen', 'aluno_codigo_curso.png')
        await wait_and_click(page, '#btnVoltarDashboardCodigo')
        await page.waitForSelector('#alunoDashboardScreen:not(.hidden)', {'visible': True, 'timeout': 10000})
    except TimeoutError:
        print("Fluxo de Inserir Código do Curso não pôde ser completado.")

    # Fluxo 8: Painel Administrativo – Tela de Login
    try:
        await wait_and_click(page, '#tabOperador')
        await page.waitForSelector('#operadorLoginForm:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#operadorLoginForm', 'operador_login.png')
    except TimeoutError:
        print("Fluxo de Login do Painel Administrativo não pôde ser completado.")

    # Fluxo 9: Painel Administrativo – Dashboard
    try:
        await page.type('#usuarioOperador', 'admin')
        await page.type('#senhaOperador', 'senha123')
        await wait_and_click(page, '#btnLoginOperador')
        await page.waitForSelector('#operadorDashboard:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#operadorDashboard', 'operador_dashboard.png')
    except TimeoutError:
        print("Fluxo do Dashboard Administrativo não pôde ser completado.")

    # Fluxo 10: Gerenciamento de Cursos (Operador)
    try:
        await wait_and_click(page, '#btnVerCursos')
        await page.waitForSelector('#operadorCursos:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#operadorCursos', 'operador_cursos.png')
        await wait_and_click(page, '#btnVoltarDashboardOperador1')
        await page.waitForSelector('#operadorDashboard:not(.hidden)', {'visible': True, 'timeout': 10000})
    except TimeoutError:
        print("Fluxo de Gerenciamento de Cursos não pôde ser completado.")

    # Fluxo 11: Dashboard do Curso Selecionado
    try:
        await wait_and_click(page, '#adminHamburger')
        await wait_and_click(page, '#linkCurso1')
        await page.waitForSelector('#operadorDashboardCurso:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#operadorDashboardCurso', 'operador_dashboard_curso.png')
        await wait_and_click(page, '#btnVoltarDashboardCurso')
        await page.waitForSelector('#operadorDashboard:not(.hidden)', {'visible': True, 'timeout': 10000})
    except TimeoutError:
        print("Fluxo do Dashboard do Curso Selecionado não pôde ser completado.")

    # Fluxo 12: Tela de Cadastro de Alunos
    try:
        await wait_and_click(page, '#btnCadastrarAluno')
        await page.waitForSelector('#operadorCadastrarAluno:not(.hidden)', {'visible': True, 'timeout': 10000})
        await screenshot_element(page, '#operadorCadastrarAluno', 'operador_cadastrar_aluno.png')
        await wait_and_click(page, '#btnVoltarDashboardAluno')
        await page.waitForSelector('#operadorDashboard:not(.hidden)', {'visible': True, 'timeout': 10000})
    except TimeoutError:
        print("Fluxo de Cadastro de Alunos não pôde ser completado.")

    await browser.close()

if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(main())
