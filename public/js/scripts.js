const addProjectButtonClick = () => console.log('APBC');
const generateNewPaletteButtonClick = () => console.log('generate new');
const addPaletteToProjectButtonClick = () => console.log('APTPBC');
const paletteCardClick = () => console.log('card clicked');

$('.add-project-button').on('click', addProjectButtonClick);
$('.cg-generate-new-palette-button').on('click', generateNewPaletteButtonClick);
$('.add-palette-to-project-button').on('click', addPaletteToProjectButtonClick);
$('.palette-card').on('click', paletteCardClick);