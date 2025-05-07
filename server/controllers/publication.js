const { Op, Sequelize } = require('sequelize');
const { Publication, Review, ProductionType, Researcher, DoctoralStudent, Laboratory } = require('../models');
const { publicationSchema, doiSchema } = require('../validators/publication');
const { StatusCodes } = require('http-status-codes');

// Add a Publication
const addPublication = async (req, res) => {
    try {
        const { error, value } = publicationSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        const newPublication = await Publication.create(value);

        res.status(StatusCodes.CREATED).json({ message: req.t('success.PublicationCreated'), publication: newPublication });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.PublicationExists') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get all Publications
const getAllPublications = async (req, res) => {
    try {
        const allPublications = await Publication.findAll({
            include: [
                { model: Review, as: 'review', attributes: ['review_title'] },
                { model: ProductionType, as: 'production_type', attributes: ['type_name'] },
                { 
                    model: Researcher,
                    through: { attributes: [] }, // Excludes join table attributes
                    attributes: ['res_code', 'res_fname', 'res_lname', 'res_prof_email'],
                    include: [{
                        model: Laboratory,
                        as: "laboratory",
                        attributes: ["lab_name"]
                    }]
                },
                {
                    model: DoctoralStudent,
                    through: { attributes: [] },
                    attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email'] 
                },
            ],
            order: [['submission_date', 'DESC']]
        });

        if (allPublications.length === 0) {
            return res.status(StatusCodes.OK).json({ 
                message: req.t('success.PublicationEmptyTable'), 
                publications: [] 
            });
        }

        res.status(StatusCodes.OK).json({ publications: allPublications });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            error: req.t('error.InternalServerError') 
        });
    }
};

const getPublications = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 8);
        const offset = (page - 1) * limit;

        // Sorting logic
        const sortBy = req.query.sortBy || 'submission_date';
        const order = (req.query.order === 'asc') ? 'ASC' : 'DESC';
        const search = req.query.search || '';
        const laboratoryCode = req.query.laboratoryCode || null;

        // Validate sortBy column
        const validColumns = ['doi', 'article_title', 'submission_date', 'acceptance_date', 'pub_pages', 'review_num', 'type_id'];
        if (!validColumns.includes(sortBy)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: req.t('error.InvalidSortColumn')
            });
        }

        // Search condition
        const searchCondition = search ? {
            [Op.or]: [
                { article_title: { [Op.iLike]: `%${search}%` } },
                Sequelize.where(Sequelize.cast(Sequelize.col("submission_date"), "TEXT"), {
                    [Op.iLike]: `%${search}%`,
                }),
                Sequelize.where(Sequelize.cast(Sequelize.col("acceptance_date"), "TEXT"), {
                    [Op.iLike]: `%${search}%`,
                }),
            ]
        } : {};

        // Base where condition
        const whereCondition = { ...searchCondition };

        // Include associated models
        const include = [
            { model: Review, as: 'review', attributes: ['review_title'] },
            { model: ProductionType, as: 'production_type', attributes: ['type_name'] },
            { 
                model: Researcher,
                through: { attributes: [] },
                attributes: ['res_code', 'res_fname', 'res_lname', 'res_prof_email'],
                include: [{ 
                    model: Laboratory, 
                    as: "laboratory", 
                    attributes: ["lab_name"],
                    ...(laboratoryCode ? { where: { lab_code: laboratoryCode } } : {})
                }]
            },
            {
                model: DoctoralStudent,
                through: { attributes: [] },
                attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email'] 
            },
        ];

        // Fetch paginated results
        const publications = await Publication.findAll({
            where: whereCondition,
            include: include,
            order: [[sortBy, order]],
            limit: limit,
            offset: offset
        });

        // Fetch total count separately for better performance
        const totalItems = await Publication.count({ where: whereCondition });

        if (totalItems === 0) {
            return res.status(StatusCodes.OK).json({
                message: req.t('success.PublicationEmptyTable'),
                publications: [],
                totalPages: 0,
                currentPage: page
            });
        }

        const totalPages = Math.ceil(totalItems / limit);

        res.status(StatusCodes.OK).json({
            publications,
            totalPages,
            currentPage: page,
            totalItems
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Get a single Publication
const getPublication = async (req, res) => {
    // Decode the encoded DOI from the URL
    const decodedDoi = decodeURIComponent(req.params.doi);

    const { error, value: doi } = doiSchema.validate(decodedDoi);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublicationId') });

    try {
        const singlePublication = await Publication.findByPk(doi, {
            include: [
                { model: Review, as: 'review', attributes: ['review_title'] },
                { model: ProductionType, as: 'production_type', attributes: ['type_name'] },
                { 
                    model: Researcher,
                    through: { attributes: [] }, // Excludes join table attributes
                    attributes: ['res_code', 'res_fname', 'res_lname', 'res_prof_email'],
                    include: [{ 
                        model: Laboratory, 
                        as: "laboratory", 
                        attributes: ["lab_name"] 
                    }]
                },
                {
                    model: DoctoralStudent,
                    through: { attributes: [] },
                    attributes: ['reg_num', 'doc_stud_fname', 'doc_stud_lname', 'doc_stud_prof_email'] 
                },
            ]
        });

        if (!singlePublication) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublicationNotFound') });
        }

        res.status(StatusCodes.OK).json({ publication: singlePublication });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Update a Publication
const updatePublication = async (req, res) => {
    try {
        // Decode and validate the DOI from URL params
        const decodedDoi = decodeURIComponent(req.params.doi);
        const { error: doiError, value: originalDoi } = doiSchema.validate(decodedDoi);
        if (doiError) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublicationId') });

        // Validate the request body
        const { error, value: publicationData } = publicationSchema(req).validate(req.body);
        if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });

        // Check if DOI is being changed
        if (publicationData.doi && publicationData.doi !== originalDoi) {
            const existingPublication = await Publication.findOne({
                where: { doi: publicationData.doi }
            });
            if (existingPublication) {
                return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.PublicationExists') });
            }
        }

        // Perform the update
        const [updated] = await Publication.update(publicationData, {
            where: { doi: originalDoi }  // Use the original DOI in WHERE clause
        });

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublicationNotFound') });
        }

        // Get the updated publication - use new DOI if it was changed, otherwise use original
        const updatedDoi = publicationData.doi || originalDoi;
        const updatedPublication = await Publication.findByPk(updatedDoi, {
            include: [
                { model: Review, as: 'review', attributes: ['review_title'] },
                { model: ProductionType, as: 'production_type', attributes: ['type_name'] },
            ],
        });

        res.status(StatusCodes.OK).json({ 
            message: req.t('success.PublicationUpdated'), 
            publication: updatedPublication 
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

// Delete a Publication
const deletePublication = async (req, res) => {
    // Decode the encoded DOI from the URL
    const decodedDoi = decodeURIComponent(req.params.doi);

    const { error, value: doi } = doiSchema.validate(decodedDoi);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: req.t('error.InvalidPublicationId') });

    try {
        const deletedPublication = await Publication.findByPk(doi);
        if (!deletedPublication) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: req.t('error.PublicationNotFound') });
        }
    
        await deletedPublication.destroy();
    
        res.status(StatusCodes.OK).json({ message: req.t('success.PublicationDeleted'), publication: deletedPublication });
    } catch (error) {
        console.error("Database Error:", error.message);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ error: req.t('error.CannotDeletePublication') });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: req.t('error.InternalServerError') });
    }
};

module.exports = {
    addPublication,
    getPublications,
    getAllPublications,
    getPublication,
    updatePublication,
    deletePublication,
};