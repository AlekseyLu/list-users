(() => {
  let students = JSON.parse(localStorage.getItem('students')) || [];
  let valid;
  let reg = /^[А-ЯЁ][а-яё]*$/;

  document.getElementById('add-student').addEventListener('click', (e) => {

    e.preventDefault();

    const allInputForm = document.querySelector('.newPerson').querySelectorAll('input');

    valid = false;

    for (let i = 0; i < allInputForm.length; i++) {
      if (allInputForm[i].value === '') {
        document.querySelector('.error-message').classList.remove('none');
        document.querySelector('.error-message').innerHTML = 'Заполните поле: ' + allInputForm[i].name;
        return;
      }
      if (allInputForm[i].type === 'text' && !reg.test(allInputForm[i].value)) {
        document.querySelector('.error-message').classList.remove('none');
        document.querySelector('.error-message').innerHTML = 'В графе ' + allInputForm[i].name + ' введны недопустимые символы';
        return;
      }
      if (allInputForm[i].type === 'date' && allInputForm[i].valueAsNumber < 0) {
        console.log(allInputForm[i].valueAsNumber);
        document.querySelector('.error-message').classList.remove('none');
        document.querySelector('.error-message').innerHTML = 'Введите корректную дату в поле: ' + allInputForm[i].name + ' - не ранее 1900 года';
        return;
      }
      if (document.querySelector('.form__date-start').value === '') {
        document.querySelector('.error-message').classList.remove('none');
        document.querySelector('.error-message').innerHTML = 'Заполните поле: ' + document.querySelector('.form__date-start').name;
        return;
      }

      document.querySelector('.error-message').classList.add('none');

      valid = true;
    }

    if (valid === true) {
      students.push({
        name: document.querySelector('.form__surname').value + ' ' +
          document.querySelector('.form__name').value + ' ' +
          document.querySelector('.form__fatherName').value,
        date: document.querySelector('.form__date').value,
        dateStart: document.querySelector('.form__date-start').value,
        faculty: document.querySelector('.form__faculty').value
      });
      document.querySelector('.content-box').innerHTML = '';
      localStorage.setItem('students', JSON.stringify(students));

      for (const elem of allInputForm) {
        elem.value = '';
      }
      document.querySelector('.form__date-start').value = '';
    }
    createTableStudents();
  });

  function createDateStart() {
    for (let i = 2000; i <= 2023; i++) {
      const optionDate = document.createElement('option');
      optionDate.textContent = i;
      optionDate.setAttribute('value', i);
      document.querySelector('.form__date-start').append(optionDate);
    }
  }

  createDateStart();

  function createCellTable(item) {
    const addCell = document.createElement('li');
    addCell.classList.add('add-cell', 'mb-3');

    const cellName = document.createElement('span');
    const cellFaculty = document.createElement('span');
    const cellBirthday = document.createElement('span');
    const cellStartDate = document.createElement('span');

    cellName.classList.add('col-4');
    cellFaculty.classList.add('col-3');
    cellBirthday.classList.add('col-3');
    cellStartDate.classList.add('col-2');

    cellName.append(item.name);
    cellFaculty.append(item.faculty);
    cellBirthday.append(item.date, ' (', Math.floor((new Date() - new Date(item.date)) / 31536000000), ')');
    cellStartDate.append(item.dateStart + '-' + (Number(item.dateStart) + 4) + ' (' + (Number(item.dateStart) > 2019 || Number(item.dateStart) > new Date().getFullYear() ? (new Date().getFullYear() - (Number(item.dateStart) - 1)) : 'Закончил(а)') + ' курс)');
    addCell.append(cellName, cellFaculty, cellBirthday, cellStartDate);
    return addCell;
  }

  let arrayFiltStud;

  function createTableStudents() {
    const addContent = document.createElement('div');

    addContent.classList.add('content-box');

    document.querySelector('.table__item').append(addContent);

    let arrSrud = JSON.parse(localStorage.getItem('students'));

    arrSrud.forEach(item => {
      document.querySelector('.content-box').append(createCellTable(item));
    });

    const searchInputFilter = document.querySelectorAll('.search-input');

    searchInputFilter.forEach(el => {
      el.addEventListener('keyup', () => {
        document.querySelector('.content-box').innerHTML = '';

        arrayFiltStud = filterName(arrSrud);

        arrayFiltStud = filterFaculty(filterName(arrSrud));

        arrayFiltStud = filterDate(filterFaculty(filterName(arrSrud)));

        arrayFiltStud = filterDateStart(filterDate(filterFaculty(filterName(arrSrud))));

        arrayFiltStud.forEach(elem => {
          document.querySelector('.content-box').append(createCellTable(elem));
        });
      });
    });

    function filterDateStart(arr) {
      const dateStartFilter = document.querySelector('.search-date-start').value;

      let newArrFilterDateStart = [...arr];

      let arrayFilterStud = newArrFilterDateStart.filter(el => {
        return el.dateStart.includes(dateStartFilter);
      });
      return arrayFilterStud;
    }

    function filterDate(arr) {
      const dateFilter = document.querySelector('.search-date').value;

      let newArrFilterDate = [...arr];

      let arrayFilterStud = newArrFilterDate.filter(el => {
        return el.date.includes(dateFilter);
      });
      return arrayFilterStud;
    }

    function filterFaculty(arr) {
      const facultyFilter = document.querySelector('.search-faculty').value;

      let newArrFilterName = [...arr];

      let arrayFilterStud = newArrFilterName.filter(el => {
        let lowerCaseName = el.faculty.toLowerCase();
        return lowerCaseName.includes(facultyFilter.toLowerCase());
      });
      return arrayFilterStud;
    }

    function filterName(arr) {
      const nameFilter = document.querySelector('.search-name').value;

      let newArrFilterName = [...arr];

      let arrayFilterStud = newArrFilterName.filter(el => {
        let lowerCaseName = el.name.toLowerCase();
        return lowerCaseName.includes(nameFilter.toLowerCase());
      });
      return arrayFilterStud;
    }

    let click;


    document.querySelector('.table__name').addEventListener('click', () => {
      sortName(filterDateStart(filterDate(filterFaculty(filterName(arrSrud)))));
    });

    document.querySelector('.table__faculty').addEventListener('click', () => {
      sortFaculty(filterDateStart(filterDate(filterFaculty(filterName(arrSrud)))));
    });

    document.querySelector('.table__age').addEventListener('click', () => {
      sortBirthDay(filterDateStart(filterDate(filterFaculty(filterName(arrSrud)))));
    });

    document.querySelector('.table__date-start').addEventListener('click', () => {
      sortDateStart(filterDateStart(filterDate(filterFaculty(filterName(arrSrud)))));
    });

    function sortName(arr) {
      document.querySelector('.content-box').innerHTML = '';

      if (click === true) {
        click = false;
        sortNameDecr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
      } else {
        click = true;
        sortNameIncr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
      }
    }

    function sortFaculty(arr) {
      document.querySelector('.content-box').innerHTML = '';

      if (click === true) {
        sortFacultyDecr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
        click = false;
      } else {
        sortFacultyIncr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
        click = true;
      }
    }

    function sortBirthDay(arr) {
      document.querySelector('.content-box').innerHTML = '';

      if (click === true) {
        sortBirthDayDecr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
        click = false;
      } else {
        sortBirthDayIncr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
        click = true;
      }
    }

    function sortDateStart(arr) {
      document.querySelector('.content-box').innerHTML = '';

      if (click === true) {
        sortDateStartDecr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
        click = false;
      } else {
        sortDateStartIncr(arr).forEach(el => {
          document.querySelector('.content-box').append(createCellTable(el));
        });
        click = true;
      }
    }

    // Фильтр по ФИО
    function sortNameIncr(arr) {

      let arrSort = [...arr];

      arrSort.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name < b.name) return 1;
      });

      return arrSort;
    }

    function sortNameDecr(arr) {

      const arrSort = [...arr];

      arrSort.sort((a, b) => {
        if (a.name > b.name) return -1;
        if (a.name > b.name) return 1;
      });

      return arrSort;
    }

    // Фильтр по факультету
    function sortFacultyIncr(arr) {

      let newArrStud = [...arr];

      newArrStud.sort((a, b) => {
        if (a.faculty < b.faculty) return -1;
        if (a.faculty < b.faculty) return 1;
      });

      return newArrStud;
    }

    function sortFacultyDecr(arr) {

      let newArrStud = [...arr];

      newArrStud.sort((a, b) => {
        if (a.faculty > b.faculty) return -1;
        if (a.faculty > b.faculty) return 1;
      });

      return newArrStud;
    }

    // Фмльтр по дате рождения
    function sortBirthDayIncr(arr) {

      let newArrStud = [...arr];

      newArrStud.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date < b.date) return 1;
      });

      return newArrStud;
    }

    function sortBirthDayDecr(arr) {

      let newArrStud2 = [...arr];

      newArrStud2.sort((a, b) => {
        if (a.date > b.date) return -1;
        if (a.date > b.date) return 1;
      });

      return newArrStud2;
    }

    // Фильтр по году начала обучения
    function sortDateStartIncr(arr) {

      let newArrStud = [...arr];

      newArrStud.sort((a, b) => {
        if (a.dateStart < b.dateStart) return -1;
        if (a.dateStart < b.dateStart) return 1;
      });

      return newArrStud;
    }

    function sortDateStartDecr(arr) {

      let newArrStud2 = [...arr];

      newArrStud2.sort((a, b) => {
        if (a.dateStart > b.dateStart) return -1;
        if (a.dateStart > b.dateStart) return 1;
      });

      return newArrStud2;
    }
  }
  createTableStudents();
})();
