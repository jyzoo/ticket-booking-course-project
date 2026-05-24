import { useEffect, useState } from 'react';

import { api } from '../modules/auth/api';

const initialForm = {
  name: '',
  description: '',
  icon: '',
  color: '#1d4ed8',
  age_limit: 0,
};

export function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);

  async function loadCategories() {
    const response = await api.get('/categories/');
    setCategories(response.data.results ?? response.data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    await api.post('/categories/', {
      ...form,
      age_limit: Number(form.age_limit),
    });
    setForm(initialForm);
    await loadCategories();
  }

  return (
    <section className="detail-layout">
      <form className="panel stack" onSubmit={handleSubmit}>
        <h2>Новая категория</h2>
        {Object.entries({
          name: 'Название',
          description: 'Описание',
          icon: 'Иконка',
          color: 'Цвет',
          age_limit: 'Возрастное ограничение',
        }).map(([key, label]) => (
          <input
            key={key}
            className="input"
            placeholder={label}
            value={form[key]}
            onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
          />
        ))}
        <button className="primary-button" type="submit">
          Добавить категорию
        </button>
      </form>

      <div className="stack">
        <h2>Каталог категорий</h2>
        {categories.map((category) => (
          <article className="panel booking-card" key={category.id}>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <p>Возраст: {category.age_limit}+</p>
          </article>
        ))}
      </div>
    </section>
  );
}
