function showRecovery() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('recovery').style.display = 'block';
}

function showLogin() {
    document.getElementById('recovery').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

function login() {
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;

    if (user === "admin" && pass === "1234") {
        document.getElementById('login').style.display = 'none';
        document.getElementById('admin').style.display = 'block';
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

function recoverPassword() {
    let email = document.getElementById('email').value;
    alert("Se existir uma conta vinculada, um e-mail de recuperação será enviado para " + email);
    showLogin();
}

function showStudentForm() {
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById('attendance').style.display = 'none';
}

function showCourseForm() {
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'block';
    document.getElementById('attendance').style.display = 'none';
}

function showAttendance() {
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById('attendance').style.display = 'block';
    loadStudentsForAttendance();
}

function registerStudent() {
    let studentName = document.getElementById('studentName').value;
    if (studentName.trim() === "") {
        alert("Nome do aluno não pode estar vazio.");
        return;
    }

    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(studentName);
    localStorage.setItem('students', JSON.stringify(students));

    alert("Aluno cadastrado com sucesso!");
    document.getElementById('studentName').value = "";
}

function registerCourse() {
    let courseName = document.getElementById('courseName').value;
    let schedule = document.getElementById('schedule').value;

    if (courseName.trim() === "" || schedule.trim() === "") {
        alert("Preencha todos os campos.");
        return;
    }

    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.push({ name: courseName, schedule: schedule });
    localStorage.setItem('courses', JSON.stringify(courses));

    alert("Curso cadastrado com sucesso!");
    document.getElementById('courseName').value = "";
    document.getElementById('schedule').value = "";
}

function loadStudentsForAttendance() {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let listContainer = document.getElementById('studentList');
    listContainer.innerHTML = "";

    students.forEach((student, index) => {
        let div = document.createElement('div');
        div.innerHTML = `<input type="checkbox" id="student-${index}"> ${student}`;
        listContainer.appendChild(div);
    });
}

function saveAttendance() {
    alert("Chamada salva com sucesso!");
}
