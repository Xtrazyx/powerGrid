# Welcome to the Power Grid

A nice R&D project to investigate the power of a data and display generic grid.

## Installation

* Install parcel
`
yarn global add parcel-bundler
`
* Install dependencies
`
yarn install
`

## Running the project
`
yarn dev
`

## Features - TODO

PowerGrid
* cells state management ✅
* data read and assign to cell via coordinates ✅
* calculation via formula parser
* display component injection via display registry ✅
* data validation and format via formatter registry
* copy cell
* reference cell

PowerGridCell
* inner state management
* data injection into instanced component ✅
* manage standard display ✅
* manage standard input

Data Types
* string ✅
* number ✅
* files
* sandpile (!!!) ✅

Demo
* sandpile fractal ✅
* sandpile game ✅
