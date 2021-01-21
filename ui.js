function updateClipboard(newClip) {
  navigator.clipboard.writeText(newClip).then(function() {
    /* clipboard successfully set */
  }, function() {
    /* clipboard write failed */
  });
}

function get_UI_state() {
  const gui_sim_obj = glob.gui_sim.prototype.getValuesAsJSON();
  const gui_dr_obj = glob.gui_dr.prototype.getValuesAsJSON();
  const gui_caustics_obj = glob.gui_caustics.prototype.getValuesAsJSON();
  const both_obj = { gui_sim: gui_sim_obj, gui_dr: gui_dr_obj, gui_caustics: gui_caustics_obj, ctr: glob.ctr, scale: glob.scale };
  return both_obj;
}

function saveUI0() {
  const ui_obj = get_UI_state();
  // async promise
  glob.json_url.compress(ui_obj).then(output=>glob.ui0=output);
}

function restoreSettings(str) {
  glob.json_url.decompress(str).then(json => { 
    glob.gui_sim.prototype.setValuesFromJSON(json.gui_sim);
    glob.gui_dr.prototype.setValuesFromJSON(json.gui_dr);
    glob.gui_caustics.prototype.setValuesFromJSON(json.gui_caustics);
    glob.ctr = json.ctr;
    glob.ctr = [windowWidth/2,windowHeight/2];
    glob.scale = json.scale;
    // needs to be here as this is asynchronous
    reset_sim(glob.ui, glob.sim);
    redraw();
  });
}