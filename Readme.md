# Garbage Classification and Dustbin Locator

## Overview

This project is a Garbage Classification and Dustbin Locator system developed using Python Django for the backend and React for the frontend. The system aims to classify the type of garbage in an uploaded image into categories such as 'cardboard', 'glass', 'metal', 'paper', 'plastic', and 'trash'. Additionally, it provides users with information about nearby dustbins based on the classified garbage type, helping promote proper waste disposal.

## Features

- **Garbage Classification:** The system utilizes a machine learning model to classify the type of garbage in an uploaded image. The supported categories include cardboard, glass, metal, paper, plastic, and trash.

- **Dustbin Locator:** Users can receive information about nearby dustbins suitable for the type of garbage classified from the uploaded image. This feature encourages responsible waste disposal.

## Technologies Used

- **Backend:** Python Django framework is used to develop the backend server that handles image classification and communicates with the frontend.

- **Frontend:** React is employed to create an interactive and user-friendly interface, allowing users to upload images and view nearby dustbin locations.

- **Machine Learning:** The garbage classification model is integrated into the backend, utilizing Python libraries such as TensorFlow and scikit-learn.

## Setup

To run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/ZahidChandio/garbage-classification.git

## Install Dependencies
 Steps are given in Readme.txt for both the frontend and the backend.