<template>
  <div>
    <h2 id="page-heading" data-cy="CountryHeading">
      <span v-text="$t('demoJhVue973App.country.home.title')" id="country-heading">Countries</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('demoJhVue973App.country.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'CountryCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-country"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('demoJhVue973App.country.home.createLabel')"> Create a new Country </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && countries && countries.length === 0">
      <span v-text="$t('demoJhVue973App.country.home.notFound')">No countries found</span>
    </div>
    <div class="table-responsive" v-if="countries && countries.length > 0">
      <table class="table table-striped" aria-describedby="countries">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('countryName')">
              <span v-text="$t('demoJhVue973App.country.countryName')">Country Name</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'countryName'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('region.id')">
              <span v-text="$t('demoJhVue973App.country.region')">Region</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'region.id'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="country in countries" :key="country.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'CountryView', params: { countryId: country.id } }">{{ country.id }}</router-link>
            </td>
            <td>{{ country.countryName }}</td>
            <td>
              <div v-if="country.region">
                <router-link :to="{ name: 'RegionView', params: { regionId: country.region.id } }">{{ country.region.id }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'CountryView', params: { countryId: country.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'CountryEdit', params: { countryId: country.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(country)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span id="demoJhVue973App.country.delete.question" data-cy="countryDeleteDialogHeading" v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-country-heading" v-text="$t('demoJhVue973App.country.delete.question', { id: removeId })">
          Are you sure you want to delete this Country?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-country"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeCountry()"
        >
          Delete
        </button>
      </div>
    </b-modal>
    <div v-show="countries && countries.length > 0">
      <div class="row justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
      </div>
      <div class="row justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./country.component.ts"></script>
