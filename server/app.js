const express = require("express");
const i18next = require("./config/i18n");
const middleware = require("i18next-http-middleware");
const { StatusCodes } = require('http-status-codes');
const app = express();
const cors = require("cors");
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require("express-rate-limit");
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./config/passport');
const { ensureAuthenticated, ensureRole } = require('./middlewares/authMiddleware');

const facultyRouter = require("./routes/faculty");
const domainRouter = require("./routes/domain");
const departmentRouter = require("./routes/department");
const functionRouter = require("./routes/function");
const teamRouter = require("./routes/team");
const specialityRouter = require("./routes/speciality");
const productionTypeRouter = require("./routes/productionType");
const categoryRouter = require("./routes/category");
const reviewSpecialityRouter = require("./routes/reviewSpeciality");
const publisherRouter = require("./routes/publisher");
const laboratoryRouter = require("./routes/laboratory");
const communicationRouter = require("./routes/communication");
const equipmentRouter = require("./routes/equipment");
const publicationRouter = require("./routes/publication");
const researcherRouter = require("./routes/researcher");
const doctoralStudentRouter = require("./routes/doctoralStudent");
const reviewRouter = require("./routes/review");
const roleRouter = require("./routes/role");
const userRouter = require("./routes/user");

const superviseRouter = require("./routes/supervise");
const assignResearcherRouter = require("./routes/assignResearcher");
const assignDoctoralStudentRouter = require("./routes/assignDoctoralStudent");
const publishResearcherPubRouter = require("./routes/publishResearcherPub");
const publishResearcherCommRouter = require("./routes/publishResearcherComm");
const publishDoctoralStudentPubRouter = require("./routes/publishDoctoralStudentPub");
const publishDoctoralStudentCommRouter = require("./routes/publishDoctoralStudentComm");
const hasCategoryRouter = require("./routes/hasCategory");
const hasSpecialityRouter = require("./routes/hasSpeciality");

const excelExportResearcher = require("./routes/excel/excelResearcher");
const excelExportDoctoralStudent = require("./routes/excel/excelDoctoralStudent");
const excelExportLaboratory = require("./routes/excel/excelLaboratory");
const excelExportTeam = require("./routes/excel/excelTeam");
const excelExportEquipment = require("./routes/excel/excelEquipment");
const excelExportPublication = require("./routes/excel/excelPublication");
const excelExportCommunication = require("./routes/excel/excelCommunication");
const excelExportSupervision = require("./routes/excel/excelSupervision");
const excelExportAssignResearcher = require("./routes/excel/excelAssignResearcher");
const excelExportAssignDoctoralStudent = require("./routes/excel/excelAssignDoctoralStudent");

const authRoutes = require('./routes/authRoutes');

// Define rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per `windowMs`
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Include rate limit info in response headers
});

// Middleware
app.use(middleware.handle(i18next)); // Middleware to detect and use language
app.use(cors({
    origin: "http://localhost:5173", // Explicitly allow your frontend's origin
    credentials: true, // Allow cookies and authentication headers
}));

app.use(express.json());

// Use Helmet for security
app.use(helmet());

// Use Compression for performance optimization
app.use(compression());

// Apply rate limiter to all requests
app.use(limiter);

// Add Session middleware (needed for Passport sessions)
// secret: process.env.SESSION_SECRET || 'super_secret_key',
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // Adjust as needed
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

// Routes
app.use("/faculty", ensureAuthenticated, facultyRouter);
app.use("/domain", ensureAuthenticated, domainRouter);
app.use("/department", ensureAuthenticated, departmentRouter);
app.use("/function", ensureAuthenticated, functionRouter);
app.use("/team", ensureAuthenticated, teamRouter);
app.use("/speciality", ensureAuthenticated, specialityRouter);
app.use("/production-type", ensureAuthenticated, productionTypeRouter);
app.use("/category", ensureAuthenticated, categoryRouter);
app.use("/review-speciality", ensureAuthenticated, reviewSpecialityRouter);
app.use("/publisher", ensureAuthenticated, publisherRouter);
app.use("/laboratory", ensureAuthenticated, laboratoryRouter);
app.use("/communication", ensureAuthenticated, communicationRouter);
app.use("/equipment", ensureAuthenticated, equipmentRouter);
app.use("/publication", ensureAuthenticated, publicationRouter);
app.use("/researcher", ensureAuthenticated, researcherRouter);
app.use("/doctoral-student", ensureAuthenticated, doctoralStudentRouter);
app.use("/review", ensureAuthenticated, reviewRouter);
app.use("/role", ensureAuthenticated, ensureRole(['Admin']), roleRouter);
app.use("/user", ensureAuthenticated, userRouter);

app.use("/supervise", ensureAuthenticated, superviseRouter);
app.use("/assign-researcher", ensureAuthenticated, assignResearcherRouter); 
app.use("/assign-doctoral-student", ensureAuthenticated, assignDoctoralStudentRouter); 
app.use("/publish-researcher-pub", ensureAuthenticated, publishResearcherPubRouter );
app.use("/publish-researcher-comm", ensureAuthenticated, publishResearcherCommRouter); 
app.use("/publish-doctoral-student-pub", ensureAuthenticated, publishDoctoralStudentPubRouter);
app.use("/publish-doctoral-student-comm", ensureAuthenticated, publishDoctoralStudentCommRouter );
app.use("/has-category", ensureAuthenticated, hasCategoryRouter );
app.use("/has-speciality", ensureAuthenticated, hasSpecialityRouter );

app.use("/export/researchers", ensureAuthenticated, excelExportResearcher);
app.use("/export/doctoral-students", ensureAuthenticated, excelExportDoctoralStudent);
app.use("/export/laboratories", ensureAuthenticated, excelExportLaboratory);
app.use("/export/teams", ensureAuthenticated, excelExportTeam);
app.use("/export/equipments", ensureAuthenticated, excelExportEquipment);
app.use("/export/publications", ensureAuthenticated, excelExportPublication);
app.use("/export/communications", ensureAuthenticated, excelExportCommunication);
app.use("/export/supervisions", ensureAuthenticated, excelExportSupervision);
app.use("/export/researchers-assignments", ensureAuthenticated, excelExportAssignResearcher);
app.use("/export/doctoral-students-assignments", ensureAuthenticated, excelExportAssignDoctoralStudent);

// Add authentication routes
app.use("/auth", authRoutes);

// Handle non-existent routes
app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.RouteNotFound') });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
});

module.exports = app;