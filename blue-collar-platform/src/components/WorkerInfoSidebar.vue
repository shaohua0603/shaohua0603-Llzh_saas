<template>
  <div class="worker-info-sidebar" :class="{ 'open': visible }">
    <div class="sidebar-header">
      <h3>工人详情</h3>
      <el-button type="text" @click="close" class="close-button">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    <div class="sidebar-content">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="workerInfo" class="worker-details">
        <div class="info-section">
          <h4>基本信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="姓名">{{ workerInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="工号">{{ workerInfo.workerId }}</el-descriptions-item>
            <el-descriptions-item label="身份证号">{{ workerInfo.idCard }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ workerInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ workerInfo.gender === 'male' ? '男' : '女' }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ workerInfo.age }}</el-descriptions-item>
            <el-descriptions-item label="籍贯">{{ workerInfo.nativePlace }}</el-descriptions-item>
            <el-descriptions-item label="入职日期">{{ workerInfo.entryDate }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="info-section">
          <h4>工作信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="工厂">{{ workerInfo.factory }}</el-descriptions-item>
            <el-descriptions-item label="部门">{{ workerInfo.department }}</el-descriptions-item>
            <el-descriptions-item label="岗位">{{ workerInfo