<script>
import { data } from '@/components/data/data.js';
import { getStaffList } from '@/utils/common';
import { v4 as uuidv4 } from 'uuid';

export default {
  computed: {
    staffList(){
      return getStaffList(this.selectedUnit);
    },
    buttonView() {
      if (this.selectedKey) {
        if (Object.keys(this.selectedKey).length == 0) {
          return false;
        } else if (!this.selectedKey) {
          return false;
        } else return true;
      } else return false;
    },
  },
  data() {
    return {
      unitNodes: data,
      selectedUnit: null,
      selectedKey: '',
      newOffcier: {
        name: '',
        post: '',
        birthday: '',
        startWork: '',
      },
      newNode: {
        label: '',
      },
      newAdministartion: {
        label: '',
      },
      visibleModalOfficer: false,
      visibleModalNode: false,
      visibleModalAdministration: false,
      visibleModalOfficerRedact: false,
      hoveredNode: '',
      error: false,
      contextMenuTreeItems: [
        {
          label: 'Добавить узел',
          command: () => {
            this.visibleModalNode = true;
          },
        },
        {
          label: 'Удалить',
          command: () => {
            this.deleteNode(this.unitNodes);
          },
        },
      ],
      officerList: [],
      maxDate: new Date(),
      selectedOfficer: null,
      isContextMenuOpen: false,
    };
  },
  created() {
    this.maxDate = new Date();
  },
  methods: {
    declOfNum(n, text_forms) {
      n = Math.abs(n) % 100;
      var n1 = n % 10;
      if (n > 10 && n < 20) {
        return text_forms[2];
      }
      if (n1 > 1 && n1 < 5) {
        return text_forms[1];
      }
      if (n1 == 1) {
        return text_forms[0];
      }
      return text_forms[2];
    },
    onNodeMouseEnter(node) {
      this.hoveredNode = node;
    },
    onNodeMouseLeave() {
      if (!this.isContextMenuOpen) {
        this.hoveredNode = '';
      }
    },
    officerSquad(array, id) {
      for (let item of array) {
        for (let el of item.data) {
          if (el.id === id) {
            return item.label;
          }
        }
        if (Array.isArray(item.children)) {
          let result = this.officerSquad(item.children, id);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    officerPost(array, id) {
      for (let item of array) {
        for (let el of item.data) {
          if (el.id === id) {
            return el.post;
          }
        }
        if (Array.isArray(item.children)) {
          let result = this.officerPost(item.children, id);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    addOfficer(array) {
      if (
        new Date(this.newOffcier.birthday) > new Date(this.newOffcier.startWork)
      ) {
        this.error = true;
        return; // Прерываем выполнение метода, если даты некорректны
      } else {
        this.error = false;
      }

      for (let item of array) {
        if (item.key === Object.keys(this.selectedKey)[0]) {
          item.data.push({
            id: Date.now(),
            name: this.newOffcier.name,
            post: this.newOffcier.post,
            birthday: this.newOffcier.birthday,
            startWork: this.newOffcier.startWork,
          });
          this.resetForm();
          this.visibleModalOfficer = false;
          return;
        }
        if (Array.isArray(item.children)) {
          this.addOfficer(item.children);
        }
      }
    },

    resetForm() {
      this.newOffcier = {
        name: '',
        post: '',
        birthday: '',
        startWork: '',
      };
    },
    
    openContextMenuTree(event) {
      this.isContextMenuOpen = true;
      this.$refs.menu.show(event);
    },
    closeContextMenuTree() {
      this.isContextMenuOpen = false;
    },
    selectNode(node) {
      this.selectedUnit = node;
    },

    deleteNode(array) {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (item.key === Object.keys(this.selectedKey)[0]) {
          array.splice(i, 1);
          this.selectedKey = null;
          return true;
        }
        if (Array.isArray(item.children)) {
          if (this.deleteNode(item.children)) {
            return true;
          }
        }
      }
      return false;
    },
    addNode(array) {
      for (let item of array) {
        if (item.key === Object.keys(this.selectedKey)[0]) {
          item.children.push({
            key: uuidv4(),
            id: Date.now(),
            label: this.newNode.label,
            data: [],
            children: [],
          });
        }
        if (Array.isArray(item.children)) {
          let result = this.addNode(item.children);
          if (result) {
            return result;
          }
        }
      }
      this.visibleModalNode = false;
    },
    addAdmistration(array) {
      array.push({
        key: uuidv4(),
        id: Date.now(),
        label: this.newAdministartion.label,
        data: [],
        children: [],
      });
      this.visibleModalAdministration = false;
      this.newAdministartion.label = '';
    },
    getAverageAge(officers) {
      let sum = 0;
      for (let officer of officers) {
        sum +=
          new Date().getFullYear() - new Date(officer.birthday).getFullYear();
      }
      if (officers.length === 0) {
        return 0;
      }
      return Math.floor(sum / officers.length);
    },

    getAverageWork(officers) {
      let sum = 0;
      for (let officer of officers) {
        sum +=
          new Date().getFullYear() - new Date(officer.startWork).getFullYear();
      }
      if (officers.length === 0) {
        return 0;
      }
      return Math.floor(sum / officers.length);
    },
    editOfficer(officer) {
      this.selectedOfficer = { ...officer };
      this.visibleModalOfficerRedact = true;
    },
    redactOfficer(array) {
      if (
        new Date(this.selectedOfficer.birthday) >
        new Date(this.selectedOfficer.startWork)
      ) {
        this.error = true;
      } else {
        for (let item of array) {
          const index = item.data.findIndex(
            (o) => o.id === this.selectedOfficer.id
          );
          if (index !== -1) {
            item.data[index] = { ...this.selectedOfficer };
            this.visibleModalOfficerRedact = false;
            return true;
          }
          if (Array.isArray(item.children)) {
            let result = this.redactOfficer(item.children);
            if (result) {
              return result;
            }
          }
        }
        return false;
      }
    },
    deleteOfficer() {
      this.deleteOfficerFromTreeData(this.selectedOfficer.id, this.unitNodes);
      this.visibleModalOfficerRedact = false;
    },
    deleteOfficerFromTreeData(id, array) {
      for (let item of array) {
        const index = item.data.findIndex((officer) => officer.id === id);
        if (index !== -1) {
          item.data.splice(index, 1);
          return true;
        }
        if (Array.isArray(item.children)) {
          if (this.deleteOfficerFromTreeData(id, item.children)) {
            return true;
          }
        }
      }
      return false;
    },
    openContextMenuTree(event) {
      this.isContextMenuOpen = true;
      this.$refs.menu.show(event);
    },
  },
};
</script>

<template>
  <Header />
  <div class="wrapper-main">
    <div class="wrapper">
      <div class="wrapper-tree">
        <Button
          label="Добавить службу"
          @click="visibleModalAdministration = true"
          severity="info"
        />
      <Tree v-model:selectionKeys="selectedKey" :value="unitNodes" selectionMode="single" class="w-full md:w-[30rem]" @node-select="selectNode">
      </Tree>
      </div>
      <div class="right-wrapper">
        <div class="info">
          <Message
            severity="info"
            class="info-item"
            v-if="staffList.length"
            >Количество сотрудников: {{ staffList.length }}</Message
          >
          <Message
            severity="info"
            class="info-item"
            v-if="staffList.length"
            >Средний возраст: {{ getAverageAge(staffList) }}
            {{
              declOfNum(getAverageAge(staffList), [
                'год',
                'года',
                'лет',
              ])
            }}
          </Message>
          <Message
            severity="info"
            class="info-item"
            v-if="staffList.length"
            >Средний стаж работы в подразделении:
            {{ getAverageWork(staffList) }}
            {{
              declOfNum(getAverageWork(staffList), [
                'год',
                'года',
                'лет',
              ])
            }}</Message
          >
          <Button
            label="Добавить сотрудника в подразделение"
            @click="visibleModalOfficer = true"
            v-if="buttonView"
            severity="info"
          />
        </div>
        <div class="officers-list">
          <div
            v-if="selectedKey"
            v-for="item in staffList"
            class="card-officer"
          >
            <Card
              style="overflow: hidden"
              class="officer-card-hover"
              @click="editOfficer(item)"
            >
              <template #header>
                <img
                  alt="user header"
                  src="https://avatars.mds.yandex.net/i?id=98e1bdcbfbcd518b6e6660534d14ad72_l-2436415-images-thumbs&n=13"
                  class="img-card"
                />
              </template>
              <template #title>{{ item.name }}</template>
              <template #subtitle>{{ officerPost(unitNodes, item.id) }}</template>

              <template #content>
                <p class="m-0">
                  {{ officerSquad(unitNodes, item.id) }}
                </p>
                <p class="m-0">
                  День рождения:
                  {{ new Date(item.birthday).toLocaleDateString('ru-RU') }}
                </p>
              </template>
            </Card>
          </div>
        </div>
      </div>

      <!-- Модальное окно добавление офицера -->

      <Dialog
        v-model:visible="visibleModalOfficer"
        modal
        header="Добавить сотрудника"
        :style="{ width: '30rem' }"
        class="dialog"
        @hide="error = false"
      >
        <div class="dialog-body">
          <span class="text-surface-500 dark:text-surface-400 block mb-8"
            >Заполните необходимые поля.</span
          >
          <div class="dialog-item">
            <label for="officerName" class="font-semibold w-24">ФИО</label>
            <InputText
              id="officerName"
              v-model="newOffcier.name"
              class="flex-auto"
              autocomplete="off"
              v-keyfilter="{
                pattern: /^[а-яА-Я\s]+$/,
              }"
            />
          </div>
          <div class="dialog-item">
            <label for="officerPost" class="font-semibold w-24"
              >Должность</label
            >
            <InputText
              id="officerPost"
              v-model="newOffcier.post"
              class="flex-auto"
              autocomplete="off"
              type="text"
              v-keyfilter="{
                pattern: /^[а-яА-Я0-9\s]+$/,
              }"
            />
          </div>
          <div class="dialog-item">
            <label for="officerBirthday" class="font-semibold w-24"
              >Дата рождения</label
            >
            <DatePicker
              id="officerBirthday"
              v-model="newOffcier.birthday"
              class="flex-auto"
              dateFormat="dd-mm-yy"
              :maxDate="maxDate"
            />
          </div>
          <div class="dialog-item">
            <label for="officerStartWork" class="font-semibold w-24"
              >Дата начала работы</label
            >
            <DatePicker
              id="officerStartWork"
              v-model="newOffcier.startWork"
              class="flex-auto"
              dateFormat="dd-mm-yy"
              :maxDate="maxDate"
            />
          </div>
          <div :style="{ color: 'red' }" v-if="error">
            Проверте правильность выбранных дат
          </div>
          <div class="dialog-footer">
            <Button
              type="button"
              label="Отмена"
              severity="secondary"
              @click="visibleModalOfficer = false"
            ></Button>
            <Button
              type="button"
              label="Сохранить"
              @click="addOfficer(unitNodes)"
            ></Button>
          </div>
        </div>
      </Dialog>

      <!-- Конец модального окна  -->

      <!-- Модальное окно добавление узла -->

      <Dialog
        v-model:visible="visibleModalNode"
        modal
        header="Добавить узел"
        :style="{ width: '28rem' }"
        class="dialog"
      >
        <div class="dialog-body">
          <span class="text-surface-500 dark:text-surface-400 block mb-8"
            >Заполните необходимые поля.</span
          >
          <div class="dialog-item">
            <label for="nodeName" class="font-semibold w-24"
              >Название подразделения</label
            >
            <InputText
              id="nodeName"
              v-model="newNode.label"
              class="flex-auto"
              autocomplete="off"
              v-keyfilter="{
                pattern: /^[а-яА-Я0-9\s]+$/,
              }"
            />
          </div>

          <div class="dialog-footer">
            <Button
              type="button"
              label="Отмена"
              severity="secondary"
              @click="visibleModalNode = false"
            ></Button>
            <Button
              type="button"
              label="Сохранить"
              @click="addNode(unitNodes)"
            ></Button>
          </div>
        </div>
      </Dialog>

      <!-- Конец модального окна  -->

      <!-- Модальное окно добавления первого узла -->
      <Dialog
        v-model:visible="visibleModalAdministration"
        modal
        header="Добавить службу"
        :style="{ width: '28rem' }"
        class="dialog"
      >
        <div class="dialog-body">
          <span class="text-surface-500 dark:text-surface-400 block mb-8"
            >Заполните необходимые поля.</span
          >
          <div class="dialog-item">
            <label for="nodeName" class="font-semibold w-24"
              >Название службы</label
            >
            <InputText
              id="nodeName"
              v-model="newAdministartion.label"
              class="flex-auto"
              autocomplete="off"
              v-keyfilter="{
                pattern: /^[а-яА-Я0-9\s]+$/,
              }"
            />
          </div>

          <div class="dialog-footer">
            <Button
              type="button"
              label="Отмена"
              severity="secondary"
              @click="visibleModalAdministration = false"
            ></Button>
            <Button
              type="button"
              label="Сохранить"
              @click="addAdmistration(unitNodes)"
            ></Button>
          </div>
        </div>
      </Dialog>
      <!-- Конец модального окна -->

      <!-- Модальное окно редактирования офицера -->

      <Dialog
        v-model:visible="visibleModalOfficerRedact"
        modal
        header="Изменить данные сотрудника"
        :style="{ width: '28rem' }"
        class="dialog"
        @hide="error = false"
      >
        <div class="dialog-body">
          <span class="text-surface-500 dark:text-surface-400 block mb-8"
            >Заполните необходимые поля.</span
          >
          <div class="dialog-item">
            <label for="officerName" class="font-semibold w-24">ФИО</label>
            <InputText
              id="officerName"
              v-model="selectedOfficer.name"
              class="flex-auto"
              autocomplete="off"
              type="text"
              v-keyfilter="{
                pattern: /^[а-яА-Я\s]+$/,
              }"
            />
          </div>
          <div class="dialog-item">
            <label for="officerPost" class="font-semibold w-24"
              >Должность</label
            >
            <InputText
              id="officerPost"
              v-model="selectedOfficer.post"
              class="flex-auto"
              autocomplete="off"
              type="text"
              v-keyfilter="{
                pattern: /^[а-яА-Я0-9\s]+$/,
              }"
            />
          </div>
          <div class="dialog-item">
            <label for="officerBirthday" class="font-semibold w-24"
              >Дата рождения</label
            >
            <DatePicker
              id="officerBirthday"
              v-model="selectedOfficer.birthday"
              class="flex-auto"
              dateFormat="dd-mm-yy"
              :maxDate="maxDate"
            />
          </div>
          <div class="dialog-item">
            <label for="officerStartWork" class="font-semibold w-24"
              >Дата начала работы</label
            >
            <DatePicker
              id="officerStartWork"
              v-model="selectedOfficer.startWork"
              class="flex-auto"
              dateFormat="dd-mm-yy"
              :maxDate="maxDate"
            />
          </div>
          <div :style="{ color: 'red' }" v-if="error">
            Проверте правильность выбранных дат
          </div>
          <div class="dialog-footer">
            <Button
              type="button"
              label="Отмена"
              severity="secondary"
              @click="visibleModalOfficerRedact = false"
            ></Button>
            <Button
              type="button"
              label="Удалить"
              @click="deleteOfficer"
              severity="danger"
            ></Button>
            <Button
              type="button"
              label="Сохранить"
              @click="redactOfficer(unitNodes)"
            ></Button>
          </div>
        </div>
      </Dialog>
      <!-- Конец модального окна -->
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}
.right-wrapper {
  grid-column-start: 3;
  grid-column-end: -1;
}

.card-officer {
  max-width: 250px;
  cursor: pointer;
  flex-wrap: wrap;
  transition: 0.3s;
}

.card-officer:hover {
  transform: scale(103%);
}

.img-card {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.officers-list {
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: space-evenly;
  gap: 40px;
  margin-top: 20px;
}

.tree-item {
  display: flex;
  flex-direction: row;
}

.burger {
  margin-left: 15px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialog-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  width: 100%;
  justify-content: space-between;
}
.dialog-footer {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
.wrapper-main {
  padding: 0 20px;
  min-height: 100vh;
}
.wrapper-tree {
  grid-column-start: 1;
  grid-column-end: 3;
}
</style>
