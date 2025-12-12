document.addEventListener('DOMContentLoaded', () => {
    const equipmentList = document.getElementById('equipment-list');
    const rentalFormSection = document.getElementById('rental-form-section');
    const catalogSection = document.getElementById('catalog');
    const rentalForm = document.getElementById('rental-form');
    const cancelBtn = document.getElementById('cancel-rental');

    // Form fields
    const equipmentIdInput = document.getElementById('equipment-id');
    const equipmentNameInput = document.getElementById('equipment-name');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const totalPriceDisplay = document.getElementById('total-price');

    let currentEquipmentPrice = 0;

    // Fetch and display equipment
    fetchEquipment();

    async function fetchEquipment() {
        try {
            const response = await fetch('/api/equipment');
            const equipment = await response.json();
            renderEquipment(equipment);
        } catch (error) {
            console.error('Error loading equipment:', error);
            equipmentList.innerHTML = '<div class="loading">Ошибка загрузки данных. Пожалуйста, обновите страницу.</div>';
        }
    }

    function renderEquipment(items) {
        equipmentList.innerHTML = '';
        if (items.length === 0) {
            equipmentList.innerHTML = '<div class="loading">Нет доступной техники.</div>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-image">🚜</div>
                <div class="card-content">
                    <h3 class="card-title">${item.name}</h3>
                    <p>${item.description || 'Описание отсутствует'}</p>
                    <div class="card-price">${item.price_per_day} ₽ / день</div>
                    <button class="btn btn-primary rent-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price_per_day}">
                        Арендовать
                    </button>
                </div>
            `;
            equipmentList.appendChild(card);
        });

        // Add event listeners to rent buttons
        document.querySelectorAll('.rent-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const { id, name, price } = e.target.dataset;
                openRentalForm(id, name, price);
            });
        });
    }

    function openRentalForm(id, name, price) {
        equipmentIdInput.value = id;
        equipmentNameInput.value = name;
        currentEquipmentPrice = parseFloat(price);

        // Set default dates (today and tomorrow)
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

        startDateInput.value = today;
        endDateInput.value = tomorrow;
        startDateInput.min = today;
        endDateInput.min = today;

        calculateTotal();

        catalogSection.classList.add('hidden');
        rentalFormSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function closeRentalForm() {
        rentalForm.reset();
        rentalFormSection.classList.add('hidden');
        catalogSection.classList.remove('hidden');
    }

    function calculateTotal() {
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);

        if (start && end && !isNaN(start) && !isNaN(end)) {
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const days = diffDays > 0 ? diffDays : 1; // Minimum 1 day
            const total = days * currentEquipmentPrice;
            totalPriceDisplay.textContent = `${total} ₽`;
        }
    }

    // Orders Modal Logic
    const ordersBtn = document.getElementById('orders-btn');
    const ordersModal = document.getElementById('orders-modal');
    const closeModalSpan = document.querySelector('.close-modal');
    const ordersTableBody = document.querySelector('#orders-table tbody');

    ordersBtn.addEventListener('click', openOrdersModal);
    closeModalSpan.addEventListener('click', () => ordersModal.classList.add('hidden'));
    window.addEventListener('click', (e) => {
        if (e.target === ordersModal) {
            ordersModal.classList.add('hidden');
        }
    });

    async function openOrdersModal() {
        ordersModal.classList.remove('hidden');
        ordersTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Загрузка...</td></tr>';

        try {
            const response = await fetch('/api/rentals');
            const rentals = await response.json();

            ordersTableBody.innerHTML = '';

            if (rentals.length === 0) {
                ordersTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Заказов пока нет.</td></tr>';
                return;
            }

            rentals.forEach(rental => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${rental.equipment ? rental.equipment.name : 'Удалено'}</td>
                    <td>
                        ${rental.client ? rental.client.name : 'Неизвестно'}<br>
                        <small>${rental.client ? rental.client.email : ''}</small>
                    </td>
                    <td>${new Date(rental.start_date).toLocaleDateString()}</td>
                    <td>${new Date(rental.end_date).toLocaleDateString()}</td>
                    <td>${rental.status}</td>
                `;
                ordersTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading rentals:', error);
            ordersTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Ошибка загрузки данных</td></tr>';
        }
    }

    // Event Listeners
    cancelBtn.addEventListener('click', closeRentalForm);
    startDateInput.addEventListener('change', calculateTotal);
    endDateInput.addEventListener('change', calculateTotal);

    rentalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            equipment_id: equipmentIdInput.value,
            client_name: document.getElementById('client-name').value,
            client_email: document.getElementById('client-email').value,
            start_date: startDateInput.value,
            end_date: endDateInput.value
        };

        try {
            const response = await fetch('/api/rentals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Заявка на аренду успешно отправлена!');
                closeRentalForm();
            } else {
                const error = await response.json();
                alert(`Ошибка: ${error.error || 'Не удалось оформить аренду'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Произошла ошибка при отправке формы.');
        }
    });
});
