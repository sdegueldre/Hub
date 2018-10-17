// ==UserScript==
// @name     YouTube full height theater
// @version  1
// @grant    none
// ==/UserScript==

let log = true;

if((typeof log != 'undefined') && log)
  console.log("Page matched, running full height theater script");

window.addEventListener('load', resizeTheater);

async function resizeTheater(){
  let playerContainer = await waitLoaded('player-theater-container', 500, log);
  let topBar = await waitLoaded('masthead-container', 500, log);
  if(playerContainer != null && topBar != null){
    let barHeight = topBar.clientHeight;
    playerContainer.style.maxHeight = `calc(100vh - ${barHeight}px)`;
    window.dispatchEvent(new Event('resize'));
    if((typeof log != 'undefined') && log)
      console.log("Successfully resized youtube theater");
  } else if((typeof log != 'undefined') && log)
      console.log("Couldn't resize youtube theater");
}

async function waitLoaded(id, timeout, log){
  if((typeof log != 'undefined') && log)
    console.log(`Attempting to load ${id}`);
  let element;
  let i = 0;
  while((element = document.getElementById(id)) == null && 10*i < timeout){
    await sleep(10, log);
    i++;
  }
  if(element == null && (typeof log != 'undefined') && log)
    console.log(`Timed out while trying to load ${id}`);
  else if((typeof log != 'undefined') && log)
    console.log(`Waited ${10*i}ms for ${id} to be loaded`);
  return element;
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}