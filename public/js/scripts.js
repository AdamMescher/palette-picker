let currentColors = [];

const addProjectButtonClick = event => {
  event.preventDefault();

  postProjectAndAppendProjectCard($('.add-project-input').val());
  resetAddNewProjectInputField();
  $('.add-project-button').attr('disabled', true);
};
const generateNewPaletteButtonClick = () => {
  changeApertureColors();
  changeLockColors(currentColors);
  rotateArrows();
  rotateAperture();
};
const addNewPaletteToProjectButtonClick = event => {
  event.preventDefault();

  const paletteName = $('.cg-form-palette-name-input').val();
  const selectedProjectID = $('.cg-form-project-select option:selected').attr('class').replace(/\D/g,'');
  const parsedSelectedProjectID = parseInt(selectedProjectID);

  postPaletteToProjectAndAppendCard(paletteName, parsedSelectedProjectID, currentColors);
  resetAddNewPaletteInputField();
  $('.cg-form-add-palette-button').attr('disabled', true);
};

const postPaletteToProjectAndAppendCard = (name, projectID, colors) => {
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

  fetch(`/api/v1/projects/${projectID}/palettes`, fetchPayload)
    .then(response => response.json())
    .then(id => {
      const palette = Object.assign({}, fetchBody, id);
      appendPaletteCard(projectID, palette);
    })
    .catch(error => { error }); 
}

const postProjectAndAppendProjectCard = projectName => {
  const fetchBody = {name: projectName};
  const fetchPayload = buildPostFetchPayload(fetchBody);

  fetch(`/api/v1/projects`, fetchPayload)
    .then(response => response.json())
    .then(id => {
      const project = {
        id,
        name: projectName
      };
      appendProjectCardFromUser(project);
      appendProjectToSelect(project); 
    })
    .catch(error => { error });
}

const deletePaletteFromProject = (paletteID, projectID) => {
  const fetchPayload = buildDeleteFetchPayload();

  fetch(`/api/v1/projects/${projectID}/palettes/${paletteID}`, fetchPayload)
  .catch(error => { error });
}

const deleteProject = projectID => {
  const fetchPayload = buildDeleteFetchPayload();

  fetch(`/api/v1/projects/${projectID}`, fetchPayload)
  .catch(error => { error });
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

$('.add-project-button').on('click', addProjectButtonClick);
$('.cg-generate-new-palette-button').on('click', generateNewPaletteButtonClick);
// $('.palette-card').on('click', paletteCardClick);
$('.cg-form-add-palette-button').on('click', addNewPaletteToProjectButtonClick);
$('.cg-form-palette-name-input').keyup(function() {
  if ($(this).val() !== '') {
    $('.cg-form-add-palette-button').removeAttr('disabled');
  };
});
$('.add-project-input').keyup(function() {
  if ($(this).val() !== '') {
    $('.add-project-button').removeAttr('disabled');
  };
});
$('.all-projects-container').on('click', '.palette-card-delete-button', function(){
  const paletteID = parseInt($(this).parent().parent().attr('id').replace(/\D/g, ''));
  const projectID = parseInt($(this).parent().parent().parent().attr('id').replace(/\D/g, ''));
  
  deletePaletteFromProject(paletteID, projectID);
  $(this).parent().parent().remove();
});
$('.all-projects-container').on('click', '.delete-project-card-button', function() {
  const projectID = parseInt($(this).parent().parent().attr('id').replace(/\D/g, ''));
  
  deleteProject(projectID);
  $(this).parent().parent().remove();
  $(`#project-id-${projectID}`).remove();
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

  if(!$('.color-one-lock button').hasClass('locked')){
    currentColors[0] = colors[0];
    $('.cg-aperture-1').css('fill', colors[0]);
  }
  if(!$('.color-two-lock button').hasClass('locked')){
    currentColors[1] = colors[1];
    $('.cg-aperture-2').css('fill', colors[1]);
  }
  if (!$('.color-three-lock button').hasClass('locked')) {
    currentColors[2] = colors[2];
    $('.cg-aperture-3').css('fill', colors[2]);
  }
  if (!$('.color-four-lock button').hasClass('locked')) {
    currentColors[3] = colors[3];
    $('.cg-aperture-4').css('fill', colors[3]);
  }
  if (!$('.color-five-lock button').hasClass('locked')) {
    currentColors[4] = colors[4];
    $('.cg-aperture-5').css('fill', colors[4]);
  }
};

const changeLockColors = colors => {
  if (colors) {
    $('.color-one-lock').css('background-color', colors[0]);
    $('.color-one-lock button span').text(`${colors[0]}`);

    $('.color-two-lock').css('background-color', colors[1]);
    $('.color-two-lock button span').text(`${colors[1]}`);

    $('.color-three-lock').css('background-color', colors[2]);
    $('.color-three-lock button span').text(`${colors[2]}`);

    $('.color-four-lock').css('background-color', colors[3]);
    $('.color-four-lock button span').text(`${colors[3]}`);

    $('.color-five-lock').css('background-color', colors[4]);
    $('.color-five-lock button span').text(`${colors[4]}`);
  }
}

const appendProjectCard = project => {
  $('.all-projects-container').append(`
    <article class="project-card" id="project-id-${project.id}">
      <div class="project-card-main"></div>
      <div class="project-card-title">
        <span>${project.name}</span>
        <button class="delete-project-card-button"></button>
      </div>
    </article>`);
};

const appendProjectCardFromUser = project => {
  $('.all-projects-container').append(`
    <article class="project-card" id="project-id-${project.id.project[0]}" >
      <div class="project-card-main"></div>
      <div class="project-card-title">
        <span>${project.name}</span>
        <button class="delete-project-card-button"></button>
      </div>
    </article>`);
};
const appendProjectNamesToSelect = project => {
  $('.cg-form-project-select').append(`
    <option class="option-project-id-${project.id}">${project.name}</option>
  `)
};
const appendPaletteCard = (projectID, palette) => {
  $(`#project-id-${projectID}`).append(
    `<div class="palette-card" id="palette-id-${palette.id}">
      <div class="palette-card-colors-container">
        <div class="color-one" style="background-color: #${palette.color_one};">
          <span>#${palette.color_one}</span>
        </div>
        <div class = "color-two" style="background-color: #${palette.color_two};">
          <span>#${palette.color_two}</span>
        </div>
        <div class = "color-three" style="background-color: #${palette.color_three};">
          <span>#${palette.color_three}</span>
        </div>
        <div class = "color-four" style="background-color: #${palette.color_four};">
          <span>#${palette.color_four}</span>
        </div>
        <div class = "color-five" style="background-color: #${palette.color_five};">
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
const getProjectsFromPostgres = () => {
  fetch('/api/v1/projects/')
    .then(response => response.json())
    .then(response => response.projects.map(project => {
      appendProjectNamesToSelect(project);
      appendProjectCard(project);
      fetch(`/api/v1/projects/${project.id}/palettes`)
        .then(response => response.json())
        .then(response => response.palettes.map(palette => {
          appendPaletteCard(project.id, palette);
          updatePaletteCardBackgroundColors(palette);
        })) // END THEN
        .catch(error => { error });
    }))
    .catch(error => { error });
};
const updatePaletteCardBackgroundColors = palette => {
  $(`#palette-id-${palette.id}`).find('.color-one').css('background-color', `#${palette.color_one}`);
  $(`#palette-id-${palette.id}`).find('.color-two').css('background-color', `#${palette.color_two}`);
  $(`#palette-id-${palette.id}`).find('.color-three').css('background-color', `#${palette.color_three}`);
  $(`#palette-id-${palette.id}`).find('.color-four').css('background-color', `#${palette.color_four}`);
  $(`#palette-id-${palette.id}`).find('.color-five').css('background-color', `#${palette.color_five}`);
};
const updateCurrentColors = colors => currentColors = colors;

// ON PAGE LOAD
getProjectsFromPostgres();
changeApertureColors();
changeLockColors(currentColors);

// APPEND PROJECTS TO SELECT
const appendProjectToSelect = project => {
  $('.cg-form-project-select').append(`<option class="option-project-id-${project.id.project[0]}">${project.name}</option>`);
};

// ANIMATIONS
const rotateArrows = () => {
  const rotateButton = $('.cg-generate-new-palette-button');
  const oldButtonCount = parseInt(rotateButton.attr('data-generate-new-palette-button-count'));
  const newButtonCount = oldButtonCount + 1;
  const newDegree = newButtonCount * 180;

  rotateButton.attr('data-generate-new-palette-button-count', newButtonCount);
  rotateButton.css('transform', `rotate(${newDegree}deg)`);
};

const rotateAperture = ()=> {
  const rotateButton = $('.cg-generate-new-palette-button');
  const aperture = $('.cg-aperture');
  const oldButtonCount = parseInt(rotateButton.attr('data-generate-new-palette-button-count'));
  const newButtonCount = oldButtonCount + 1;
  let newDegree = 0;

  if(newButtonCount % 2 === 0 ) {
    newDegree = newButtonCount + 144;
  } else {
    newDegree = newButtonCount - 144;
  }

  aperture.css('transform', `rotate(${newDegree}deg)`);
};

const resetAddNewPaletteInputField = () => {
  $('.cg-form-palette-name-input').val('');
}

const resetAddNewProjectInputField = () => {
  $('.add-project-input').val('');
}

