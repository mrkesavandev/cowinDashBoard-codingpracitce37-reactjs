// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

const initialValue = {
  success: 'SUCCESS',
  pending: 'PENDING',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {coWinData: {}, displayStatus: initialValue.initial}

  componentDidMount() {
    this.getCovidVaccinationApi()
  }

  getCovidVaccinationApi = async () => {
    this.setState({displayStatus: initialValue.pending})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const fetchData = await fetch(url)

    if (fetchData.ok === true) {
      const data = await fetchData.json()
      const convertData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByGender: data.vaccination_by_gender,
        vaccinationAge: data.vaccination_by_age,
      }
      this.setState({
        coWinData: convertData,
        displayStatus: initialValue.success,
      })
    } else {
      this.setState({displayStatus: initialValue.failure})
    }
  }

  renderPycharts = () => {
    const {coWinData} = this.state
    const {
      last7DaysVaccination,
      vaccinationAge,
      vaccinationByGender,
    } = coWinData

    return (
      <div>
        <VaccinationCoverage vaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationGenderData={vaccinationByGender} />
        <VaccinationByAge vaccinationAgeData={vaccinationAge} />
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-view-text">Something went wrong</h1>
    </div>
  )

  switchTheValue = () => {
    const {displayStatus} = this.state

    switch (displayStatus) {
      case initialValue.success:
        return this.renderPycharts()
      case initialValue.pending:
        return this.renderLoader()
      case initialValue.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-name-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
            className="website-img"
          />
          <p className="main-heading">Co-WIN</p>
        </div>
        <h1 className="description">CoWIN Vaccination in India</h1>
        <div> {this.switchTheValue()}</div>
      </div>
    )
  }
}

export default CowinDashboard
