# Requirements Document

## Introduction

本项目是一个基于 TypeScript + React + D3.js 的算法可视化应用，用于演示 LeetCode 第39题"组合总和"的回溯算法解题过程。应用将以动画形式展示算法如何通过递归回溯找出所有满足目标和的组合，帮助用户直观理解回溯算法的工作原理。

## Glossary

- **Visualizer**: 算法可视化应用系统
- **Candidates**: 无重复元素的整数数组，作为组合的候选数字
- **Target**: 目标整数，组合中数字的和需要等于此值
- **Combination**: 一组候选数字的集合，其和等于目标值
- **Backtracking Tree**: 回溯树，展示算法递归搜索过程的树形结构
- **Current Path**: 当前路径，算法正在探索的数字组合
- **Remaining Sum**: 剩余和，目标值减去当前路径数字之和

## Requirements

### Requirement 1: 用户输入配置

**User Story:** As a user, I want to input custom candidates array and target value, so that I can visualize the algorithm with different test cases.

#### Acceptance Criteria

1. WHEN the Visualizer loads THEN the Visualizer SHALL display input fields for candidates array and target value with default values (candidates=[2,3,6,7], target=7)
2. WHEN a user enters a candidates array THEN the Visualizer SHALL validate that all elements are integers between 2 and 40 with no duplicates
3. WHEN a user enters a target value THEN the Visualizer SHALL validate that the value is an integer between 1 and 40
4. IF a user enters invalid input THEN the Visualizer SHALL display a clear error message indicating the validation failure
5. WHEN a user clicks the start button with valid inputs THEN the Visualizer SHALL begin the algorithm visualization

### Requirement 2: 回溯树可视化

**User Story:** As a user, I want to see the backtracking tree structure, so that I can understand how the algorithm explores different combinations.

#### Acceptance Criteria

1. WHEN the algorithm starts THEN the Visualizer SHALL render a tree structure using D3.js with the root node representing the initial state (remaining=target)
2. WHEN the algorithm explores a new candidate THEN the Visualizer SHALL animate the addition of a child node showing the selected number and remaining sum
3. WHEN the algorithm backtracks THEN the Visualizer SHALL visually highlight the backtracking path with a distinct color
4. WHEN a valid combination is found THEN the Visualizer SHALL highlight the successful path in green
5. WHEN a path is pruned (remaining < 0) THEN the Visualizer SHALL mark the node in red to indicate pruning

### Requirement 3: 当前状态显示

**User Story:** As a user, I want to see the current algorithm state, so that I can follow the step-by-step execution.

#### Acceptance Criteria

1. WHILE the algorithm is running THEN the Visualizer SHALL display the current path (selected numbers) in a dedicated panel
2. WHILE the algorithm is running THEN the Visualizer SHALL display the current remaining sum
3. WHILE the algorithm is running THEN the Visualizer SHALL highlight the current candidate being considered
4. WHEN a combination is found THEN the Visualizer SHALL add it to a results list panel

### Requirement 4: 动画控制

**User Story:** As a user, I want to control the animation playback, so that I can learn at my own pace.

#### Acceptance Criteria

1. WHEN the Visualizer is in animation mode THEN the Visualizer SHALL provide play/pause button functionality
2. WHEN the Visualizer is in animation mode THEN the Visualizer SHALL provide step forward button to advance one step at a time
3. WHEN the Visualizer is in animation mode THEN the Visualizer SHALL provide a speed slider to adjust animation speed (0.5x to 3x)
4. WHEN the Visualizer is in animation mode THEN the Visualizer SHALL provide a reset button to restart the visualization
5. WHEN the animation completes THEN the Visualizer SHALL display all found combinations in the results panel

### Requirement 5: 单屏幕布局

**User Story:** As a user, I want all visualization components on a single screen, so that I can see the complete picture without scrolling.

#### Acceptance Criteria

1. WHEN the Visualizer loads THEN the Visualizer SHALL render all components within a single viewport without vertical scrolling
2. WHEN the Visualizer loads THEN the Visualizer SHALL organize the layout with input controls at top, tree visualization in center, and state/results panels on the sides
3. WHEN the browser window is resized THEN the Visualizer SHALL responsively adjust the tree visualization to fit the available space

### Requirement 6: 算法代码展示

**User Story:** As a user, I want to see the algorithm code with current execution line highlighted, so that I can correlate the visualization with the code.

#### Acceptance Criteria

1. WHEN the Visualizer loads THEN the Visualizer SHALL display the backtracking algorithm pseudocode in a code panel
2. WHILE the algorithm is running THEN the Visualizer SHALL highlight the current line of code being executed
3. WHEN the algorithm state changes THEN the Visualizer SHALL update the highlighted line to reflect the current operation
