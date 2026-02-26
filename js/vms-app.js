/**
 * NuraEye VMS - AngularJS Main Module
 */
var app = angular.module('vmsApp', []);

/**
 * Mock Backend Service
 * Simulates API calls to a backend server.
 */
app.service('MockBackendService', ['$q', '$timeout', function ($q, $timeout) {
    var self = this;

    // --- Data Generation Helpers ---
    var _locations = ['Building A', 'Building B', 'Parking Lot', 'Main Entrance', 'Lobby', 'Warehouse'];

    // Public method to get locations
    this.getLocations = function () {
        return _delay(200).then(function () {
            return _locations;
        });
    };

    // Unified Camera Database
    var _cameras = [
        { id: 'cam-001', name: 'Lobby Main', location: 'Lobby', status: 'Online', ip: '192.168.1.101', recording: true, time: '2m ago' },
        { id: 'cam-002', name: 'Lobby Elevator', location: 'Lobby', status: 'Online', ip: '192.168.1.102', recording: true, time: '5m ago' },
        { id: 'cam-003', name: 'Front Desk', location: 'Lobby', status: 'Offline', ip: '192.168.1.103', recording: false, time: '1h ago' },
        { id: 'cam-004', name: 'Building A East', location: 'Building A', status: 'Online', ip: '192.168.1.104', recording: true, time: '10m ago' },
        { id: 'cam-005', name: 'Building A West', location: 'Building A', status: 'Warning', ip: '192.168.1.105', recording: false, time: '20m ago' },
        { id: 'cam-006', name: 'Parking Lot North', location: 'Parking Lot', status: 'Online', ip: '192.168.1.106', recording: true, time: 'Just now' },
        { id: 'cam-007', name: 'Parking Lot South', location: 'Parking Lot', status: 'Offline', ip: '192.168.1.107', recording: false, time: '3h ago' },
        { id: 'cam-008', name: 'Main Entrance Ext', location: 'Main Entrance', status: 'Online', ip: '192.168.1.108', recording: true, time: '1m ago' },
        { id: 'cam-009', name: 'Main Gate', location: 'Main Entrance', status: 'Warning', ip: '192.168.1.109', recording: true, time: '15m ago' },
        { id: 'cam-010', name: 'Warehouse Loading', location: 'Warehouse', status: 'Online', ip: '192.168.1.110', recording: true, time: '5m ago' },
        { id: 'cam-011', name: 'Warehouse Int', location: 'Warehouse', status: 'Online', ip: '192.168.1.111', recording: true, time: '7m ago' },
        { id: 'cam-012', name: 'Building B Hall', location: 'Building B', status: 'Online', ip: '192.168.1.112', recording: true, time: '12m ago' }
    ];

    // --- Simulated Database ---
    var _db = {
        cameras: _cameras,
        systemStatus: {
            storageUsage: 78, retentionDays: 45, cpuLoad: 32, memoryUsage: 65,
            serverStatus: 'Healthy', uptime: '14d 6h'
        },
        alerts: [
            { id: 'alt-101', type: 'Intrusion', severity: 'Critical', location: 'Warehouse Loading', cameraName: 'Warehouse Loading', description: 'Person detected after hours', timestamp: Date.now() - 500000, timeAgo: '8m ago', status: 'Unread' },
            { id: 'alt-102', type: 'Motion', severity: 'Medium', location: 'Parking Lot North', cameraName: 'Parking Lot North', description: 'Vehicle entered restricted zone', timestamp: Date.now() - 1200000, timeAgo: '20m ago', status: 'Unread' },
            { id: 'alt-103', type: 'Weapon Detected', severity: 'Critical', location: 'Main Gate', cameraName: 'Main Gate', description: 'Possible weapon detected on camera', timestamp: Date.now() - 3600000, timeAgo: '1h ago', status: 'Read' },
            { id: 'alt-104', type: 'Camera Offline', severity: 'High', location: 'Lobby', cameraName: 'Front Desk', description: 'Camera 003 dropped connection', timestamp: Date.now() - 7200000, timeAgo: '2h ago', status: 'Unread' },
            { id: 'alt-105', type: 'Motion', severity: 'Low', location: 'Building A', cameraName: 'Building A East', description: 'Motion detected in hallway', timestamp: Date.now() - 86400000, timeAgo: '1d ago', status: 'Resolved' }
        ]
    };

    // Helper to simulate network delay
    var _delay = function (ms) {
        ms = ms || 600;
        return $timeout(function () { }, ms);
    };

    // --- Dashboard Methods ---
    this.getDashboardData = function () {
        return _delay(800).then(function () {
            // Dynamic Stats Calculation
            var total = _db.cameras.length;
            var online = _db.cameras.filter(c => c.status === 'Online').length;
            var offline = _db.cameras.filter(c => c.status === 'Offline').length;
            var recording = _db.cameras.filter(c => c.recording).length;

            _db.cameraSummary = { total: total, online: online, offline: offline, recording: recording };

            var issues = _db.cameras.filter(c => c.status !== 'Online');

            // Limit issues for dashboard widget
            _db.cameraIssues = issues.slice(0, 5);

            var liveStatus = angular.copy(_db.systemStatus);
            // Simulate minor fluctuations
            liveStatus.cpuLoad = Math.max(10, Math.min(95, liveStatus.cpuLoad + (Math.random() * 10 - 5))).toFixed(0);
            liveStatus.memoryUsage = Math.max(20, Math.min(90, liveStatus.memoryUsage + (Math.random() * 4 - 2))).toFixed(0);

            // Dashboard only shows recent active alerts (slice of unread)
            var recentAlerts = _db.alerts.filter(a => a.status === 'Unread').slice(0, 5);

            return {
                cameraSummary: _db.cameraSummary,
                systemStatus: liveStatus,
                cameraIssues: _db.cameraIssues,
                alerts: recentAlerts
            };
        });
    };

    // --- Camera Methods ---
    this.getCameras = function () {
        return _delay(600).then(function () {
            // Return persistent list
            return _db.cameras;
        });
    };

    // --- Alerts Page Methods ---
    this.getAlerts = function (filters) {
        return _delay(500).then(function () {
            return _db.alerts;
        });
    };

    this.acknowledgeAlert = function (id) {
        return _delay(200).then(function () {
            return true;
        });
    };

    this.acknowledgeAll = function () {
        return _delay(400).then(function () {
            return true;
        });
    };

    this.resolveAlert = function (id) {
        return _delay(200).then(function () {
            return true;
        });
    };

    this.deleteAlert = function (id) {
        return _delay(200).then(function () {
            return true;
        });
    };

}]);

/**
 * Main Controller
 * Handles global navigation and user state.
 */
app.controller('MainController', ['$rootScope', '$scope', '$timeout', '$http', 'MockBackendService', 'KafkaService', function ($rootScope, $scope, $timeout, $http, MockBackendService, KafkaService) {
    // --- Kafka Initialization ---
    KafkaService.connect().then(function () {
        console.log("MainController: KafkaService Connected");
    }, function (err) {
        console.error("MainController: KafkaService connection failed", err);
    });

    // --- Internationalization (i18n) ---
    $rootScope.translations = {};

    $scope.changeLanguage = function (langKey) {
        $http.get('locales/' + langKey + '.json').then(function (response) {
            $rootScope.translations = response.data;
            localStorage.setItem("preferred_language", langKey);
            document.documentElement.lang = langKey;
        }).catch(function (error) {
            console.error('Error loading language file:', error);
            // Fallback to English if file not found
            if (langKey !== 'en') {
                $scope.changeLanguage('en');
            }
        });
    };

    // Initialize Language
    var savedLang = localStorage.getItem("preferred_language") || 'en';
    $scope.changeLanguage(savedLang);

    $scope.activePage = 'dashboard';

    // User Profile
    $scope.user = {
        name: 'John Doe',
        role: 'Administrator',
        initials: 'JD'
    };

    $scope.isUserDropdownOpen = false;

    $scope.navigateTo = function (page) {
        $scope.activePage = page;
        console.log("Navigating to: " + page);
    };

    // Camera Issue Details Navigation - SRS Requirement 2.1
    $scope.currentIssue = null;
    $scope.openIssueDetails = function (issue) {
        console.log("Navigating to Issue Details for:", issue.name);
        $scope.currentIssue = issue;
        $scope.activePage = 'camera-issue-details';

        // Critical: Broadcast data to child controller (SRS 4.2 / 5.2 data requirements)
        // Timeout ensures the child controller is instantiated and listening
        $timeout(function () {
            $scope.$broadcast('ISSUE_DATA_UPDATED', issue);
        }, 100);
    };

    // Event Listener for Child Controllers
    $scope.$on('OPEN_ISSUE_DETAILS', function (evt, issue) {
        $scope.openIssueDetails(issue);
    });

    // --- Alert Details Navigation --- (SRS Requirement)
    $scope.openAlertDetails = function (alert) {
        console.log("MainController: Navigating to Alert Details for:", alert.id);
        $scope.activePage = 'alert-details';

        $timeout(function () {
            $scope.$broadcast('ALERT_DATA_UPDATED', alert);
        }, 100);
    };

    $scope.$on('OPEN_ALERT_DETAILS', function (evt, alert) {
        $scope.openAlertDetails(alert);
    });

    // Handle "Live Camera" navigation from Alerts
    $scope.$on('OPEN_CAMERA_LIVE', function (evt, cameraId) {
        console.log("Navigating to Live Camera:", cameraId);
        // alert("MainController received OPEN_CAMERA_LIVE for ID: " + cameraId); // Debug

        $scope.activePage = 'camera-settings';

        MockBackendService.getCameras().then(function (cameras) {
            // Use loose equality (==) for ID matching to handle string/number differences
            var cam = cameras.find(function (c) { return c.id == cameraId; });

            if (cam) {
                console.log("Found camera:", cam.name);
                $timeout(function () {
                    console.log("Broadcasting OPEN_CAMERA_SETTINGS");
                    $scope.$broadcast('OPEN_CAMERA_SETTINGS', cam, 'live');
                }, 100);
            } else {
                console.error("Camera not found for ID:", cameraId);
                alert("Error: Camera not found (ID: " + cameraId + ")");
            }
        });
    });

    // Dropdown Toggles
    $scope.toggleUserDropdown = function (event) {
        event.stopPropagation();
        $scope.isUserDropdownOpen = !$scope.isUserDropdownOpen;
    };

    $scope.isSearchDropdownOpen = false;
    $scope.toggleSearchDropdown = function (event) {
        event.stopPropagation();
        $scope.isSearchDropdownOpen = !$scope.isSearchDropdownOpen;
    };

    // Close dropdowns on click outside (using a directive is cleaner, but this works for MVP)
    document.addEventListener('click', function () {
        $scope.$applyAsync(function () {
            if ($scope.isUserDropdownOpen) $scope.isUserDropdownOpen = false;
        });
    });

    // Theme Logic
    $scope.theme = 'dark'; // Default

    $scope.setTheme = function (newTheme) {
        $scope.theme = newTheme;
        if (newTheme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    };

    // Initialize theme on load
    $scope.setTheme($scope.theme);

    $scope.toggleTheme = function () {
        var newTheme = $scope.theme === 'light' ? 'dark' : 'light';
        $scope.setTheme(newTheme);
    };

    // Global Modal Handlers
    $scope.showConfirmModal = false;
    $scope.showDeleteModal = false;

    $scope.cancelAction = function () {
        $scope.showConfirmModal = false;
    };

    $scope.cancelDelete = function () {
        $scope.showDeleteModal = false;
    };
}]);
