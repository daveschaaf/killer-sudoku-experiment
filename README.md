# Killer Sudoku Experiment

A web-based experiment investigating whether AI-assisted learning improves performance on a new cognitive task compared to a video tutorial or no assistance at all.

## Research Overview

This study was developed by students at the UC Berkeley School of Information Master of Information and Data Science progra as part of a research project on AI-assisted learning.

### Research Question

Does learning with an AI tutor improve performance on mastering a new puzzle compared to self-discovery or a video tutorial?

### Background

Large language models (LLMs) have become a popular tool for students seeking personalized tutoring. However, there is an open question about whether AI assistance leads to genuine learning and retention, or whether students over-rely on the AI without internalizing the underlying material. Prior studies (Chen 2025, Lyu 2024, Goel & Lieb 2024) show mixed results — AI tutors can improve homework performance, but those gains sometimes disappear on proctored assessments where the AI is unavailable.

### Experiment Design

Participants are randomly assigned to one of three conditions:

- **Control** — given the rules of Killer Sudoku and asked to solve a practice puzzle on their own
- **Video** — given the rules and a YouTube tutorial video to assist with the practice puzzle
- **AI Tutor** — given the rules and access to a GPT-4o powered tutor chatbot to assist with the practice puzzle

After the learning phase, all participants solve a second test puzzle with no assistance. The key outcome measures are completion rate and solve time on the test puzzle.

### Puzzle

The experiment uses a 6×6 Killer Sudoku puzzle hosted on [SudokuPad](https://sudokupad.app). Killer Sudoku combines standard Sudoku rules with cage constraints — groups of cells must sum to a given number with no repeated digits within a cage.

### Hypotheses

- If the AI tutor successfully promotes learning, the AI group should complete the test puzzle at a higher rate and in less time than the control group.
- If participants over-rely on the AI during learning, there will be no significant difference between the AI and control groups on the test puzzle.
- The video tutorial serves as a non-personalized learning aid benchmark between the two.

### Recruitment

Participants are recruited through UC Berkeley's SONA research participant pool and the MIDS program network. No personally identifiable information is collected. Participants are assigned an anonymous ID at the start of the session.

## References

- Chen et al. (2025). AI knows best? The paradox of expertise, AI-reliance, and performance in educational tutoring decision-making tasks. arXiv.
- Lyu et al. (2024). Evaluating the Effectiveness of LLMs in Introductory Computer Science Education: A Semester-Long Field Study. ACM.
- Lieb & Goel (2024). Student Interaction with NewtBot: An LLM-as-tutor Chatbot for Secondary Physics Education. ACM.
