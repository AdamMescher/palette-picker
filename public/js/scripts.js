let currentColors = [];

const addProjectButtonClick = () => console.log('APBC');
const generateNewPaletteButtonClick = () => {
  changeApertureColors();
  changeLockColors(currentColors);
  rotateArrows();
  rotateAperture();
};
const addPaletteToProjectButtonClick = () => {
  console.log('DELETE BUTTON PRESSED');
};
const addNewPaletteToProjectButtonClick = event => {
  event.preventDefault();

  let paletteName = $('.cg-form-palette-name-input').val();
  const selectedProjectID = $('.cg-form-project-select option:selected').attr('class').replace(/\D/g,'');
  const parsedSelectedProjectID = parseInt(selectedProjectID);

  postPaletteToProject(paletteName, parsedSelectedProjectID, currentColors);
  removeAllProjectCards();
  getProjectsFromPostgres();
};

const colorLockButtonClick = () => {
  console.log($(this));
}
const postPaletteToProject = (name, projectID, colors, ) => {
  const fetchBody = {
    name: name,
    project_id: projectID,
    color_one: colors[0].replace(/\W/g, ''),
    color_two: colors[1].replace(/\W/g, ''),
    color_three: colors[2].replace(/\W/g, ''),
    color_four: colors[3].replace(/\W/g, ''),
    color_five: colors[4].replace(/\W/g, ''),
  };
  const fetchPayload = buildPostFetchPayload(fetchBody);

  fetch(`http://localhost:3000/api/v1/projects/${projectID}/palettes`, fetchPayload);
}

const deletePaletteFromProject = (paletteID, projectID) => {
  const fetchPayload = buildDeleteFetchPayload();

  fetch(`http://localhost:3000/api/v1/projects/${projectID}/palettes/${paletteID}`, fetchPayload)
    .then(response => response.json())
    .then(response => console.log(response))
}

const buildPostFetchPayload = body => ({
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(body)
});

const buildDeleteFetchPayload = () => ({
  headers: {
    "Content-Type": "application/json"
  },
  method: "DELETE"
});

const paletteCardClick = () => console.log('card clicked');

$('.add-project-button').on('click', addProjectButtonClick);
$('.cg-generate-new-palette-button').on('click', generateNewPaletteButtonClick);
$('.add-palette-to-project-button').on('click', addPaletteToProjectButtonClick);
$('.palette-card').on('click', paletteCardClick);
$('.cg-form-add-palette-button').on('click', addNewPaletteToProjectButtonClick);
$('.all-projects-container').on('click', '.palette-card-delete-button', function(){
  const paletteID = parseInt($(this).parent().parent().attr('id').replace(/\D/g, ''));
  const projectID = parseInt($(this).parent().parent().parent().parent().attr('id').replace(/\D/g, ''));
  
  deletePaletteFromProject(paletteID, projectID);
  $(this).parent().parent().parent().remove();
});
$('.color-lock-button').on('click', function() {
  $(this).toggleClass('locked');
});

const generateNewColorPalette = () => {
  let colorPaletteArray = [];

  for (let i = 0; i < 5; i++) {
    colorPaletteArray.push(generateNewHexColor());
  }
  return colorPaletteArray;
}

const generateNewHexColor = () => {
  // https://www.paulirish.com/2009/random-hex-color-code-snippets/
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

const changeApertureColors = () => {
  const colors = generateNewColorPalette();

  ($('.color-one-lock button').hasClass('locked'))
    ? null
    : $('.cg-aperture-1').css('fill', colors[0])
  (!$('.color-two-lock button').hasClass('locked'))
    ? $('.cg-aperture-1').css('fill', colors[1])
    : null
  ($('.color-three-lock button').hasClass('locked'))
    ? $('.cg-aperture-1').css('fill', colors[2])
    : null
  (!$('.color-four-lock button').hasClass('locked'))
    ? $('.cg-aperture-1').css('fill', colors[3])
    : null
  (!$('.color-five-lock button').hasClass('locked'))
    ? $('.cg-aperture-1').css('fill', colors[4])
    : null
  // $('.color-one-lock button').hasClass('locked')
  //   : $('.cg-aperture-1').css('fill', colors[0])
  //   ? null
  // $('.cg-aperture-2').css('fill', colors[1])
  // $('.cg-aperture-3').css('fill', colors[2]);
  // $('.cg-aperture-4').css('fill', colors[3]);
  // $('.cg-aperture-5').css('fill', colors[4]);

  updateCurrentColors(colors);
};

const changeLockColors = colors => {
  console.log('fired change lock colors');
  console.log($('.color-lock-one'));
  $('.color-one-lock').css('background-color', colors[0]);
  $('.color-two-lock').css('background-color', colors[1]);
  $('.color-three-lock').css('background-color', colors[2]);
  $('.color-four-lock').css('background-color', colors[3]);
  $('.color-five-lock').css('background-color', colors[4]);
}

const appendProjectCard = project => {
  $('.all-projects-container').prepend(
    `<article class="project-card" id="project-id-${project.id}">
      <div class="project-card-main"></div>
      <!-- <div class="project-card-add-new-pallete">
        <button class="add-palette-to-project-button"></button>
      </div> -->
      <div class="project-card-title">
        <span>${project.name}</span>
      </div>
    </article>`
  );
};

const appendPaletteCard = (projectID, palette) => {
  $(`#project-id-${projectID}`).find('.project-card-main').append(
    `<div class="palette-card" id="palette-id-${palette.id}">
      <div class="palette-card-colors-container">
        <div class="color-one">
          <span>#${palette.color_one}</span>
        </div>
        <div class="color-two">
          <span>#${palette.color_two}</span>
        </div>
        <div class="color-three">
          <span>#${palette.color_three}</span>
        </div>
        <div class="color-four">
          <span>#${palette.color_four}</span>
        </div>
        <div class="color-five">
          <span>#${palette.color_five}</span>
        </div>
      </div>
      <div class="palette-card-title">
        <span>${palette.name}</span>
        <button class="palette-card-delete-button"></button>
      </div>
    </div>`
  );
};

const appendCreateNewProjectButton = id => {
  
}

const getProjectsFromPostgres = () => {
  fetch('http://localhost:3000/api/v1/projects/')
    .then(response => response.json())
    .then(response => response.projects.map(project => {
      appendProjectNamesToSelect(project);
      appendProjectCard(project);
      fetch(`http://localhost:3000/api/v1/projects/${project.id}/palettes`)
        .then(response => response.json())
        .then(response => response.palettes.map(palette => {
          appendPaletteCard(project.id, palette);
          updatePaletteCardBackgroundColors(palette);
        }))
    }))
};

const updatePaletteCardBackgroundColors = (palette) => {
  $(`#palette-id-${palette.id}`).find('.color-one').css('background-color', `#${palette.color_one}`);
  $(`#palette-id-${palette.id}`).find('.color-two').css('background-color', `#${palette.color_two}`);
  $(`#palette-id-${palette.id}`).find('.color-three').css('background-color', `#${palette.color_three}`);
  $(`#palette-id-${palette.id}`).find('.color-four').css('background-color', `#${palette.color_four}`);
  $(`#palette-id-${palette.id}`).find('.color-five').css('background-color', `#${palette.color_five}`);
}

const updateCurrentColors = colors => currentColors = colors;

// ON PAGE LOAD
getProjectsFromPostgres();
changeApertureColors();
changeLockColors(currentColors);

// APPEND PROJECTS TO SELECT

const appendProjectNamesToSelect = project => {
  $('.cg-form-project-select').append(`<option class="option-project-id-${project.id}">${project.name}</option>`);
}

// ANIMATIONS
const rotateArrows = () => {
  $('.cg-generate-new-palette-button').toggleClass('rotate');
};

const rotateAperture = ()=> {
  const aperture = $('.cg-aperture');
  const apertureClasses = aperture.attr('class').split(' ');

  switch (apertureClasses[apertureClasses.length - 1]) {
    case 'aperture-position-one':
      aperture.removeClass('aperture-position-one');
      aperture.addClass('aperture-position-two');
      break;
    case 'aperture-position-two':
      aperture.removeClass('aperture-position-two');
      aperture.addClass('aperture-position-three');
      break;
    case 'aperture-position-three':
      aperture.removeClass('aperture-position-three');
      aperture.addClass('aperture-position-four');
      break;
    case 'aperture-position-four':
      aperture.removeClass('aperture-position-four');
      aperture.addClass('aperture-position-five');
      break;
    case 'aperture-position-five':
      aperture.removeClass('aperture-position-five');
      aperture.addClass('aperture-position-one');
      break;
    default:
      aperture.addClass('aperture-position-one');
      break;
  }
}

const removeAllProjectCards = () => {
  $('.project-card').remove();
}

