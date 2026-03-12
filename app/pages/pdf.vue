<script setup lang="ts">
const form = reactive({
  city: 'Рязань',
  date: new Date().toLocaleDateString('ru-RU'),

  sellerName: '',
  sellerBirthDate: '',
  sellerBirthPlace: '',
  sellerAddress: '',
  sellerPassportSeries: '',
  sellerPassportNumber: '',
  sellerPassportIssuedBy: '',
  sellerPassportIssuedDate: '',

  buyerName: '',
  buyerBirthDate: '',
  buyerBirthPlace: '',
  buyerAddress: '',
  buyerPassportSeries: '',
  buyerPassportNumber: '',
  buyerPassportIssuedBy: '',
  buyerPassportIssuedDate: '',

  carMakeModel: '',
  carType: '',
  carYear: '',
  vin: '',
  mileage: '',
  power: '',
  engineVolume: '',
  color: '',
  plateNumber: '',

  price: '',
  extras: '',
})

const handlePrint = () => {
  if (typeof window === 'undefined') return
  window.print()
}
</script>

<template>
  <div class="pdf-page">
    <div class="pdf-page__layout">
      <div class="pdf-page__form">
        <h1 class="pdf-page__title">Договор купли-продажи (ДКП)</h1>
        <p class="pdf-page__subtitle">
          Заполните данные — справа сформируется макет договора. Нажмите «Скачать в PDF», чтобы открыть
          диалог печати и сохранить файл.
        </p>

        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Город</label>
            <input v-model="form.city" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Дата</label>
            <input v-model="form.date" type="text" class="pdf-page__input" />
          </div>
        </div>

        <h2 class="pdf-page__section-title">Продавец</h2>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">ФИО</label>
            <input v-model="form.sellerName" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Дата рождения</label>
            <input v-model="form.sellerBirthDate" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Место рождения</label>
            <input v-model="form.sellerBirthPlace" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Адрес регистрации</label>
            <input v-model="form.sellerAddress" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Паспорт: серия и номер</label>
            <input v-model="form.sellerPassportSeries" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Кем и когда выдан</label>
            <input v-model="form.sellerPassportIssuedBy" type="text" class="pdf-page__input" />
          </div>
        </div>

        <h2 class="pdf-page__section-title">Покупатель</h2>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">ФИО</label>
            <input v-model="form.buyerName" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Дата рождения</label>
            <input v-model="form.buyerBirthDate" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Место рождения</label>
            <input v-model="form.buyerBirthPlace" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Адрес регистрации</label>
            <input v-model="form.buyerAddress" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Паспорт: серия и номер</label>
            <input v-model="form.buyerPassportSeries" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Кем и когда выдан</label>
            <input v-model="form.buyerPassportIssuedBy" type="text" class="pdf-page__input" />
          </div>
        </div>

        <h2 class="pdf-page__section-title">Автомобиль</h2>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Марка, модель</label>
            <input v-model="form.carMakeModel" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Тип ТС (легковой, грузовой и т.п.)</label>
            <input v-model="form.carType" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Год выпуска</label>
            <input v-model="form.carYear" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">VIN</label>
            <input v-model="form.vin" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Пробег, км</label>
            <input v-model="form.mileage" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Мощность, л.с.</label>
            <input v-model="form.power" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Рабочий объём двигателя, куб. см</label>
            <input v-model="form.engineVolume" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Цвет кузова</label>
            <input v-model="form.color" type="text" class="pdf-page__input" />
          </div>
        </div>
        <div class="pdf-page__form-grid">
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Гос. номер</label>
            <input v-model="form.plateNumber" type="text" class="pdf-page__input" />
          </div>
          <div class="pdf-page__form-group">
            <label class="pdf-page__label">Цена (₽)</label>
            <input v-model="form.price" type="text" class="pdf-page__input" />
          </div>
        </div>

        <div class="pdf-page__form-group">
          <label class="pdf-page__label">Дополнительные условия (опционально)</label>
          <textarea v-model="form.extras" rows="3" class="pdf-page__input pdf-page__input--textarea" />
        </div>

        <button type="button" class="pdf-page__btn" @click="handlePrint">
          Скачать в PDF
        </button>
      </div>

      <div class="pdf-page__preview-wrap">
        <div class="pdf-page__preview">
          <div class="pdf-doc">
            <h1 class="pdf-doc__title">Договор купли-продажи транспортного средства</h1>

            <p class="pdf-doc__row">
              Место составления: {{ form.city || '________________' }}<br>
              Дата составления: {{ form.date || '«___» __________ 20___ г.' }}
            </p>

            <p class="pdf-doc__paragraph">
              Гражданин(ка) {{ form.sellerName || '________________' }}, {{ form.sellerBirthDate || 'дата рождения' }},
              место рождения: {{ form.sellerBirthPlace || '________________' }}, адрес места жительства:
              {{ form.sellerAddress || '________________' }}, паспорт: {{ form.sellerPassportSeries || 'серия и номер' }},
              выдан {{ form.sellerPassportIssuedBy || 'кем и когда выдан' }}, именуемый(ая) в дальнейшем «Продавец», с
              одной стороны, и гражданин(ка) {{ form.buyerName || '________________' }},
              {{ form.buyerBirthDate || 'дата рождения' }}, место рождения:
              {{ form.buyerBirthPlace || '________________' }}, адрес места жительства:
              {{ form.buyerAddress || '________________' }}, паспорт:
              {{ form.buyerPassportSeries || 'серия и номер' }}, выдан
              {{ form.buyerPassportIssuedBy || 'кем и когда выдан' }}, именуемый(ая) в дальнейшем «Покупатель», с другой
              стороны, совместно именуемые «Стороны», заключили настоящий договор купли-продажи транспортного средства
              (далее — «Договор») о нижеследующем:
            </p>

            <h2 class="pdf-doc__subtitle">1. Предмет договора</h2>
            <p class="pdf-doc__paragraph">
              1.1. Продавец обязуется передать в собственность Покупателя, а Покупатель принять и
              оплатить следующее транспортное средство (далее — «ТС»):
            </p>
            <ul class="pdf-doc__list">
              <li>Марка и модель ТС: {{ form.carMakeModel || '________________' }}</li>
              <li>Тип ТС: {{ form.carType || '________________' }}</li>
              <li>Год изготовления ТС: {{ form.carYear || '____' }}</li>
              <li>Идентификационный номер (VIN): {{ form.vin || '________________' }}</li>
              <li>Пробег, км: {{ form.mileage || '________________' }}</li>
              <li>Мощность двигателя, л.с.: {{ form.power || '________________' }}</li>
              <li>Рабочий объём двигателя, куб. см: {{ form.engineVolume || '________________' }}</li>
              <li>Цвет кузова: {{ form.color || '________________' }}</li>
              <li>Государственный регистрационный знак: {{ form.plateNumber || '________________' }}</li>
            </ul>

            <p class="pdf-doc__paragraph">
              1.2. Собственником ТС до передачи его Покупателю является Продавец.
            </p>
            <p class="pdf-doc__paragraph">
              1.3. Право собственности на ТС переходит к Покупателю с момента подписания настоящего
              Договора Сторонами и фактической передачи ТС.
            </p>

            <h2 class="pdf-doc__subtitle">2. Цена и порядок расчётов</h2>
            <p class="pdf-doc__paragraph">
              2.1. Стоимость ТС по настоящему Договору составляет
              {{ form.price ? form.price + ' (рублей).' : '________________ (рублей).' }}
            </p>
            <p class="pdf-doc__paragraph">
              2.2. Расчёты между Сторонами производятся единовременно в день подписания настоящего
              Договора наличными денежными средствами или иным согласованным Сторонами способом.
            </p>

            <h2 class="pdf-doc__subtitle">3. Гарантии Продавца</h2>
            <p class="pdf-doc__paragraph">
              3.1. Продавец гарантирует, что на момент заключения настоящего Договора:
            </p>
            <ul class="pdf-doc__list">
              <li>ТС принадлежит Продавцу на праве собственности;</li>
              <li>ТС не находится в залоге, под арестом, не является предметом спора;</li>
              <li>в отношении ТС не наложен запрет на регистрационные действия;</li>
              <li>ТС не числится в розыске и не имеет иных скрытых обременений.</li>
            </ul>

            <h2 class="pdf-doc__subtitle">4. Дополнительные условия</h2>
            <p class="pdf-doc__paragraph" v-if="form.extras">
              {{ form.extras }}
            </p>
            <p class="pdf-doc__paragraph" v-else>
              Дополнительные условия отсутствуют либо будут согласованы Сторонами отдельно и оформлены
              дополнительным документом.
            </p>

            <h2 class="pdf-doc__subtitle">5. Заключительные положения</h2>
            <p class="pdf-doc__paragraph">
              5.1. Настоящий Договор вступает в силу с момента его подписания Сторонами и действует до
              полного исполнения Сторонами своих обязательств.
            </p>
            <p class="pdf-doc__paragraph">
              5.2. Договор составлен в двух экземплярах, имеющих равную юридическую силу, по одному для
              каждой из Сторон.
            </p>

            <h2 class="pdf-doc__subtitle">6. Подписи сторон</h2>
            <div class="pdf-doc__sign-row">
              <div class="pdf-doc__sign-col">
                <div class="pdf-doc__sign-label">Продавец</div>
                <div class="pdf-doc__sign-line" />
                <div class="pdf-doc__sign-name">{{ form.sellerName || '________________' }}</div>
              </div>
              <div class="pdf-doc__sign-col">
                <div class="pdf-doc__sign-label">Покупатель</div>
                <div class="pdf-doc__sign-line" />
                <div class="pdf-doc__sign-name">{{ form.buyerName || '________________' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pdf-page {
  min-height: 100vh;
  padding: 32px 16px;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 65%);
  color: #e5e7eb;
}

.pdf-page__layout {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.2fr);
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.pdf-page__form {
  padding: 24px 22px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.95);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
}

.pdf-page__title {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -0.03em;
}

.pdf-page__subtitle {
  margin: 0 0 20px;
  font-size: 14px;
  color: rgba(226, 232, 240, 0.8);
  line-height: 1.5;
}

.pdf-page__section-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 20px 0 10px;
  color: rgba(248, 250, 252, 0.8);
}

.pdf-page__form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 10px 14px;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.pdf-page__form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pdf-page__label {
  font-size: 12px;
  color: rgba(148, 163, 184, 0.95);
}

.pdf-page__input {
  border-radius: 10px;
  border: 1px solid rgba(51, 65, 85, 0.9);
  background: rgba(15, 23, 42, 0.85);
  padding: 9px 10px;
  color: #e5e7eb;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &:focus {
    border-color: rgba(249, 115, 22, 0.8);
    box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.6);
    background: rgba(15, 23, 42, 0.95);
  }
}

.pdf-page__input--textarea {
  resize: vertical;
}

.pdf-page__btn {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: #0b1120;
  background: linear-gradient(135deg, #f97316, #fbbf24);
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.5);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 40px rgba(249, 115, 22, 0.65);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
  }
}

.pdf-page__preview-wrap {
  display: flex;
  align-items: stretch;
}

.pdf-page__preview {
  width: 100%;
  border-radius: 18px;
  background: radial-gradient(circle at top left, rgba(148, 163, 184, 0.25), transparent 55%),
    radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.85), #020617 60%);
  padding: 16px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pdf-doc {
  width: 100%;
  max-width: 794px;
  min-height: 1123px;
  background: #ffffff;
  color: #111827;
  padding: 28px 32px;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.1);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  line-height: 1.5;
}

.pdf-doc__title {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 12px;
}

.pdf-doc__row {
  font-size: 13px;
  margin: 0 0 12px;
  text-align: right;
}

.pdf-doc__paragraph {
  margin: 0 0 10px;
  text-align: justify;
}

.pdf-doc__subtitle {
  font-size: 14px;
  font-weight: 700;
  margin: 12px 0 6px;
}

.pdf-doc__list {
  margin: 0 0 10px 18px;
  padding: 0;
}

.pdf-doc__sign-row {
  display: flex;
  gap: 40px;
  margin-top: 18px;
}

.pdf-doc__sign-col {
  flex: 1;
}

.pdf-doc__sign-label {
  font-size: 13px;
  margin-bottom: 4px;
}

.pdf-doc__sign-line {
  border-bottom: 1px solid #111827;
  height: 24px;
  margin-bottom: 4px;
}

.pdf-doc__sign-name {
  font-size: 13px;
}

@media (max-width: 960px) {
  .pdf-doc {
    min-height: auto;
  }
}

/* Скрываем интерфейс при печати, оставляем только макет договора */
@media print {
  .pdf-page {
    padding: 0;
    background: #ffffff;
  }

  .pdf-page__layout {
    display: block;
  }

  .pdf-page__form,
  .pdf-page__btn,
  .pdf-page__subtitle,
  .pdf-page__title {
    display: none !important;
  }

  .pdf-page__preview-wrap,
  .pdf-page__preview,
  .pdf-doc {
    box-shadow: none;
    padding: 0;
    margin: 0;
    max-width: 100%;
    width: 100%;
  }

  .pdf-doc {
    page-break-after: avoid;
  }
}
</style>

