// For the getting the response body available for e.g failure messages
const parseFetchResponse = response => response.text().then(text => ({
    responseBody: text,
    response: response
}));


class ApiUtil {

    /**
     * Using JSON Schema Faker, JSON server inspired by:
     * https://medium.freecodecamp.org/rapid-development-via-mock-apis-e559087be066
     */
    constructor() {
        // var customerId = window.location.pathname.split("/")[2];
        // var pollId = window.location.pathname.split("/")[6];
        // this.scheduledMeasurementsUrl = "/api/v1/customers/" + customerId + "/polls/" +
        //     pollId + "/scheduledmeasurements/";

        //Use process.env.REACT_APP_NOT_SECRET_CODE instead:
        // https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables
        // https://www.manifold.co/blog/building-a-production-grade-container-for-your-static-javascript-application-b2b2eff83fbd


        // this.apiHost = "http://localhost:8080";
        // if(process.env.REACT_APP_DIFO_API_HOST != null) {
        //     this.apiHost = process.env.REACT_APP_DIFO_API_HOST;
        // }
        //
        // console.log(this.apiHost);

        let host = "";
        if (process.env.REACT_APP_API_HOST != null) {
            host = process.env.REACT_APP_API_HOST;
        }

        this.brsUrl = host + "/api/v1/public/brs";
        this.brfsUrl = host + "/api/v1/public/brfs";
        this.housesUrl = host + "/api/v1/public/houses";
    }

    getBrs(pageNumber, pageSize, searchParams) {


        let searchQuery = "";
        Object.keys(searchParams).forEach(function (paramKey) {
            let paramValue = searchParams[paramKey];
            if (paramValue != null && (paramValue.length > 0 || typeof paramValue === "boolean")) {
                searchQuery += paramKey + ":" + paramValue + ";";
            }

            // console.log(searchQuery);

        });

        if (searchQuery.length > 0) {
            searchQuery = "&search=" + searchQuery;
        }

        const pageNumberApi = pageNumber - 1;

        return fetch(
            this.brsUrl + "?pageNumber=" + pageNumberApi + "&pageSize=" + pageSize + searchQuery,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'same-origin'
            }
        ).then(parseFetchResponse).then(({responseBody, response}) => {
            if (response.status !== 200) {
                throw Error("Failed fetching brs" +
                    "Response(status: " + response.status + ", body: " + responseBody + ")"
                );
            }
            return JSON.parse(responseBody);
        });

    }

    getBr(id) {
        return fetch(
            this.brsUrl + "/" + id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'same-origin'
            }
        ).then(parseFetchResponse).then(({responseBody, response}) => {
            if (response.status !== 200) {
                throw Error(
                    "Failed fetching br(ID: " + id + ") " +
                    "Response(status: " + response.status + ", body: " + responseBody + ")"
                );
            }
            return JSON.parse(responseBody);
        });

    }

    getBrf(id) {
        return fetch(
            this.brfsUrl + "/" + id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'same-origin'
            }
        ).then(parseFetchResponse).then(({responseBody, response}) => {
            if (response.status !== 200) {
                throw Error(
                    "Failed fetching brf(ID: " + id + ") " +
                    "Response(status: " + response.status + ", body: " + responseBody + ")"
                );
            }
            return JSON.parse(responseBody);
        });

    }


    getHouses(
        pageNumber,
        pageSize,
        searchParams
    ) {

        let searchQuery = "";
        Object.keys(searchParams).forEach(function (paramKey) {
            let paramValue = searchParams[paramKey];
            if (paramValue != null && (paramValue.length > 0 || typeof paramValue === "boolean")) {
                searchQuery += paramKey + ":" + paramValue + ";";
            }

            // console.log(searchQuery);

        });

        if (searchQuery.length > 0) {
            searchQuery = "&search=" + searchQuery;
        }

        const pageNumberApi = pageNumber - 1;

        return fetch(
            this.housesUrl + "?pageNumber=" + pageNumberApi + "&pageSize=" + pageSize + searchQuery,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'same-origin'
            }
        ).then(parseFetchResponse).then(({responseBody, response}) => {
            if (response.status !== 200) {
                throw Error("Failed fetching houses" +
                    "Response(status: " + response.status + ", body: " + responseBody + ")"
                );
            }
            return JSON.parse(responseBody);
        });

    }

    getHouse(id) {
        return fetch(
            this.housesUrl + "/" + id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: 'same-origin'
            }
        ).then(parseFetchResponse).then(({responseBody, response}) => {
            if (response.status !== 200) {
                throw Error(
                    "Failed fetching house(ID: " + id + ") " +
                    "Response(status: " + response.status + ", body: " + responseBody + ")"
                );
            }
            return JSON.parse(responseBody);
        });

    }

    createMeasurement(startAt, endAt) {

        const body = JSON.stringify({
                'start_at': startAt,
                'end_at': endAt
            }
        );

        return fetch(this.scheduledMeasurementsUrl, {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "X-CSRFToken": ApiUtil.getCookie("csrftoken")
                },
                body: body
            }
        ).then(parseFetchResponse).then(({responseBody, response}) => {
            if (response.status !== 201) {
                throw Error("Failed creating measurement. " +
                    "Request(body: " + body + "). " +
                    "Response(status: " + response.status + ", body: " + responseBody + ")"
                );
            }
            return JSON.parse(responseBody);
        });
    }

    deleteMeasurement(measurementId) {
        let url = this.scheduledMeasurementsUrl + '/' + measurementId + '/';

        return fetch(
            url, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {"X-CSRFToken": ApiUtil.getCookie("csrftoken")}
            }
        ).then(parseFetchResponse).then(({responseBody, response}) => {
            if (response.status !== 204 && response.status !== 200) {
                throw Error("Failed deleting scheduled measurement (measurementId: " + measurementId + ")." +
                    "Response(status: " + response.status + ", body: " + responseBody + ")"
                );
            }
            return true;
        });
    }

    static getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
        return "token-not-found";
    }

}

export default ApiUtil;