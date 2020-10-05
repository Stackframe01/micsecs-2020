'use strict';
import generateHeader from './Modules/generateHeader.js';
import generateFooter from './Modules/generateFooter.js';

const coverContainer = document.querySelector('.layout');

generateHeader(coverContainer);
generateFooter(coverContainer);