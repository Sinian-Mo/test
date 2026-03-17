let employees = [];
let departments = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    await loadEmployees();
    setupEventListeners();
});

async function loadEmployees() {
    try {
        const response = await fetch('data/employees.json');
        employees = await response.json();
        
        employees.forEach(emp => {
            if (emp.department) {
                departments.add(emp.department);
            }
        });
        
        renderDepartmentFilter();
        renderEmployees(employees);
        document.getElementById('totalCount').textContent = employees.length;
    } catch (error) {
        console.error('加载员工数据失败:', error);
    }
}

function renderDepartmentFilter() {
    const deptFilter = document.getElementById('deptFilter');
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        deptFilter.appendChild(option);
    });
}

function renderEmployees(emps) {
    const grid = document.getElementById('employeeGrid');
    const noResult = document.getElementById('noResult');
    
    if (emps.length === 0) {
        grid.innerHTML = '';
        noResult.style.display = 'block';
        return;
    }
    
    noResult.style.display = 'none';
    grid.innerHTML = emps.map(emp => createEmployeeCard(emp)).join('');
}

function createEmployeeCard(emp) {
    const initial = emp.name ? emp.name.charAt(0).toUpperCase() : '?';
    const avatar = emp.avatar 
        ? `<img src="${emp.avatar}" alt="${emp.name}" class="avatar">`
        : `<div class="avatar-placeholder">${initial}</div>`;
    
    return `
        <div class="employee-card">
            <div class="card-header">
                ${avatar}
                <div>
                    <div class="card-name">${emp.name || '未设置'}</div>
                    <div class="card-position">${emp.position || '未设置'}</div>
                </div>
            </div>
            <div class="card-info">
                ${emp.email ? `<div class="info-item">📧 <span>邮箱</span>${emp.email}</div>` : ''}
                ${emp.phone ? `<div class="info-item">📱 <span>手机</span>${emp.phone}</div>` : ''}
                ${emp.department ? `<div class="info-item">🏢 <span>部门</span>${emp.department}</div>` : ''}
                ${emp.joinDate ? `<div class="info-item">📅 <span>入职</span>${formatDate(emp.joinDate)}</div>` : ''}
                ${emp.department ? `<span class="dept-badge">${emp.department}</span>` : ''}
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterEmployees);
    document.getElementById('deptFilter').addEventListener('change', filterEmployees);
}

function filterEmployees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const deptFilter = document.getElementById('deptFilter').value;
    
    const filtered = employees.filter(emp => {
        const matchesSearch = !searchTerm || 
            (emp.name && emp.name.toLowerCase().includes(searchTerm)) ||
            (emp.department && emp.department.toLowerCase().includes(searchTerm)) ||
            (emp.position && emp.position.toLowerCase().includes(searchTerm));
        
        const matchesDept = !deptFilter || emp.department === deptFilter;
        
        return matchesSearch && matchesDept;
    });
    
    renderEmployees(filtered);
}