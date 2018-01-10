import Dexie from 'dexie';

let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, name',
  palettes: 'id, name, project_id, color_one, color_two, color_three, color_four, color_five'
});

const saveOfflineProjects = project => {
  return db.projects.add(project);
}

const saveOfflinePalettes = palette => {
  return db.palettes.add(palette);
}

const getSinglePallete = id => {

};

const loadOfflinePalettes = () => {

}