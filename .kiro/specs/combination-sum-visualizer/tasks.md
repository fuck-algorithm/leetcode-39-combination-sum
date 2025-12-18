# Implementation Plan

- [x] 1. 项目初始化和基础设置
  - [x] 1.1 使用 Vite 创建 React + TypeScript 项目
    - 初始化项目结构
    - 配置 TypeScript
    - 安装依赖：react, d3, fast-check, vitest
    - 配置开发服务器端口为 64440
    - _Requirements: 5.1_

  - [x] 1.2 创建核心类型定义
    - 定义 TreeNode, AlgorithmStep, NodeStatus 等接口
    - 定义 AlgorithmState, AlgorithmAction 类型
    - 定义 ValidationResult 接口
    - _Requirements: 1.2, 1.3, 2.1_

- [x] 2. 实现输入验证模块
  - [x] 2.1 实现 validateCandidates 和 validateTarget 函数
    - 验证候选数组：长度1-30，值2-40，无重复
    - 验证目标值：1-40 整数
    - 返回验证结果和错误信息
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ]* 2.2 编写输入验证属性测试
    - **Property 1: Input Validation Correctness**
    - **Validates: Requirements 1.2, 1.3, 1.4**

- [x] 3. 实现回溯算法引擎
  - [x] 3.1 实现 BacktrackingEngine.generateSteps 函数
    - 实现回溯算法生成所有组合
    - 为每个算法操作生成 AlgorithmStep
    - 包含步骤类型、当前路径、剩余和、代码行号
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [ ]* 3.2 编写剩余和不变量属性测试
    - **Property 2: Remaining Sum Invariant**
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 3.3 编写算法输出正确性属性测试
    - **Property 4: Algorithm Output Correctness**
    - **Validates: Requirements 4.5**

- [x] 4. 实现树构建模块
  - [x] 4.1 实现 TreeBuilder 类
    - 创建根节点（remaining = target）
    - 添加子节点并计算 remaining
    - 更新节点状态（exploring, success, pruned, backtracked）
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 4.2 编写节点状态正确性属性测试
    - **Property 3: Node Status Correctness**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

  - [ ]* 4.3 编写树结构一致性属性测试
    - **Property 7: Tree Structure Consistency**
    - **Validates: Requirements 2.1, 2.2**

- [x] 5. Checkpoint - 确保核心逻辑测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. 实现状态管理
  - [x] 6.1 创建 AlgorithmContext 和 reducer
    - 实现 START, STEP_FORWARD, PLAY, PAUSE, RESET, SET_SPEED actions
    - 管理 steps, currentStepIndex, isPlaying, speed, combinations 状态
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 6.2 编写步骤递进属性测试
    - **Property 5: Step Progression Monotonicity**
    - **Validates: Requirements 4.2**

- [x] 7. 实现 UI 组件
  - [x] 7.1 实现 InputPanel 组件
    - 候选数组输入框（支持逗号分隔）
    - 目标值输入框
    - 开始按钮和验证错误显示
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 7.2 实现 ControlPanel 组件
    - Play/Pause 按钮
    - Step Forward 按钮
    - Reset 按钮
    - Speed 滑块（0.5x - 3x）
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 7.3 实现 StatePanel 组件
    - 显示当前路径
    - 显示剩余和
    - 高亮当前候选数字
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 7.4 实现 ResultsPanel 组件
    - 显示已找到的组合列表
    - 动画完成时显示所有结果
    - _Requirements: 3.4, 4.5_

  - [x] 7.5 实现 CodePanel 组件
    - 显示回溯算法伪代码
    - 根据当前步骤高亮对应代码行
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 7.6 编写代码行映射属性测试
    - **Property 6: Code Line Mapping Consistency**
    - **Validates: Requirements 6.2, 6.3**

- [x] 8. 实现 D3.js 树可视化
  - [x] 8.1 实现 TreeVisualization 组件
    - 使用 D3.js 渲染树形结构
    - 实现节点颜色映射（exploring=蓝, success=绿, pruned=红, backtracked=灰）
    - 实现节点添加/更新动画
    - 响应式调整以适应容器大小
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.3_

- [x] 9. 组装主应用
  - [x] 9.1 实现 App 组件和布局
    - 整合所有组件
    - 实现单屏幕 Flexbox/Grid 布局
    - 连接 AlgorithmContext
    - _Requirements: 5.1, 5.2_

  - [x] 9.2 实现动画播放逻辑
    - 使用 useEffect 和 setInterval 实现自动播放
    - 根据 speed 调整播放间隔
    - 处理播放完成状态
    - _Requirements: 4.1, 4.3, 4.5_

- [x] 10. Final Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.
