$(function () {
    // *********************************************************************
    // Feel free to modify/remove the JS objects below.
    // *********************************************************************

    let username = "UTRGV Vaqueros";

    // There are 13 requirements to implement. 
    const userNameObj = $("#username");
    userNameObj.append(`${username}`);

    $.getJSON("/api/stats", function (stats) {
        const revenue = Number(stats.revenue).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        });

        $(".revenue-amt").text(revenue);
        $("#customer-num").text(Number(stats.customers).toLocaleString("en-US"));
        $("#orders-amt").text(Number(stats.orders).toLocaleString("en-US"));
        $("#issues-amt").text(stats.issues);
        $("#notification-num").text(stats.notifications);
    });

    function formatJoined(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${month}/${day}/${date.getUTCFullYear()}`;
    }

    function renderCustomerPage(data) {
        const tableBody = $("#customerTableBody");
        tableBody.empty();

        data.customers.forEach(customer => {
            const statusClass = customer.status === "active" ? "status-active" : "status-pending";
            const statusLabel = customer.status.charAt(0).toUpperCase() + customer.status.slice(1);
            const row = $("<tr>");

            row.append($("<td>").text(customer.name));
            row.append($("<td>").text(customer.email));
            row.append(
                $("<td>").append(
                    $("<span>").addClass("status " + statusClass).text(statusLabel)
                )
            );
            row.append($("<td>").text(formatJoined(customer.datejoined)));
            tableBody.append(row);
        });

        const pager = $("#customerPagination");
        pager.empty();

        const previous = $("<a href='#'>Previous</a>");
        const current = $("<a href='#' class='active'></a>").text(data.page + " of " + data.totalPages);
        const next = $("<a href='#'>Next</a>");

        if (data.page <= 1) {
            previous.addClass("disabled");
        } else {
            previous.on("click", function (event) {
                event.preventDefault();
                loadCustomers(data.page - 1);
            });
        }

        current.on("click", function (event) {
            event.preventDefault();
        });

        if (data.page >= data.totalPages) {
            next.addClass("disabled");
        } else {
            next.on("click", function (event) {
                event.preventDefault();
                loadCustomers(data.page + 1);
            });
        }

        pager.append(previous, current, next);
    }

    function loadCustomers(page) {
        $.getJSON("/api/customers", { page: page }, renderCustomerPage);
    }

    loadCustomers(1);

    $.getJSON("/api/sales", function (sales) {
        const salesTableBody = $("#salesTableBody");

        sales.forEach(sale => {
            const revenue = Number(sale.saleamount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
            });
            const row = $("<tr>");

            row.html(`
                <td>${sale.name}</td>
                <td>${sale.quantity}</td>
                <td>${revenue}</td>
            `);

            salesTableBody.append(row);
        });
    });

    function fillAlertList(selector, rows) {
        const list = $(selector);

        rows.forEach(row => {
            const li = $("<li>");
            li.text(row.description);
            list.append(li);
        });
    }

    $.when(
        $.getJSON("/api/alerts/issues"),
        $.getJSON("/api/alerts/notifications"),
        $.getJSON("/api/alerts/tasks")
    ).done(function (issues, notifications, tasks) {
        fillAlertList("#system-status-list", issues[0]);
        fillAlertList("#notifications-list", notifications[0]);
        fillAlertList("#tasks-list", tasks[0]);
        $("#accordion").accordion("refresh");
    });


    // All six jQuery UI functions

    $("button").button();
       
    $("#dashboardTabs").tabs();

    $("#customerDate").datepicker();

    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content"
    });

    $("#customerDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 450,
        buttons: {
            "Create Customer": function () {
                var name = $("#customerName").val();
                var email = $("#customerEmail").val();
                if (!name || !email) {
                    alert(
                        "Please enter a name and email."
                    );
                    return;
                }

                alert("Customer created: " + name);
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }

    });


    $("#newCustomerButton").on(
        "click",
        function () {
            $("#customerDialog").dialog("open");
        }
    );



       


    });
