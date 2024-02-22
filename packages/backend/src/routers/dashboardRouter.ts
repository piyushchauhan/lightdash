import express from 'express';
import {
    allowApiKeyAuthentication,
    isAuthenticated,
    unauthorisedInDemo,
} from '../controllers/authentication';
import {
    analyticsService,
    dashboardService,
    projectService,
    unfurlService,
} from '../services/services';

export const dashboardRouter = express.Router({ mergeParams: true });

dashboardRouter.get(
    '/:dashboardUuid',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.getById(
                    req.user!,
                    req.params.dashboardUuid,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.get(
    '/:dashboardUuid/views',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        analyticsService
            .getDashboardViews(req.params.dashboardUuid)
            .then((results) => {
                res.json({
                    status: 'ok',
                    results,
                });
            })
            .catch(next);
    },
);

dashboardRouter.patch(
    '/:dashboardUuid',
    allowApiKeyAuthentication,
    isAuthenticated,
    unauthorisedInDemo,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.update(
                    req.user!,
                    req.params.dashboardUuid,
                    req.body,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.patch(
    '/:dashboardUuid/pinning',
    allowApiKeyAuthentication,
    isAuthenticated,
    unauthorisedInDemo,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.togglePinning(
                    req.user!,
                    req.params.dashboardUuid,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.delete(
    '/:dashboardUuid',
    allowApiKeyAuthentication,
    isAuthenticated,
    unauthorisedInDemo,
    async (req, res, next) => {
        try {
            await dashboardService.delete(req.user!, req.params.dashboardUuid);
            res.json({
                status: 'ok',
                results: undefined,
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.get(
    '/:dashboardUuid/schedulers',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.getSchedulers(
                    req.user!,
                    req.params.dashboardUuid,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.post(
    '/:dashboardUuid/schedulers',
    allowApiKeyAuthentication,
    isAuthenticated,
    unauthorisedInDemo,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.createScheduler(
                    req.user!,
                    req.params.dashboardUuid,
                    req.body,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.post(
    '/availableFilters',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            const results =
                await projectService.getAvailableFiltersForSavedQueries(
                    req.user!,
                    req.body,
                );

            res.json({
                status: 'ok',
                results,
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.post(
    '/:dashboardUuid/export',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            const results = await unfurlService.exportDashboard(
                req.params.dashboardUuid,
                req.body.queryFilters,
                req.body.gridWidth,
                req.user!,
            );

            res.json({
                status: 'ok',
                results,
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.post(
    '/:dashboardUuid/:dashboardTileUuid/comments',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            const commentId = await dashboardService.createComment(
                req.user!,
                req.params.dashboardUuid,
                req.params.dashboardTileUuid,
                req.body.text,
                req.body.replyTo ?? null,
            );

            res.json({
                status: 'ok',
                results: commentId,
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.get(
    '/:dashboardUuid/comments',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.findCommentsForDashboard(
                    req.user!,
                    req.params.dashboardUuid,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.get(
    '/:dashboardUuid/:dashboardTileUuid/comments',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.findCommentsForDashboardTile(
                    req.user!,
                    req.params.dashboardUuid,
                    req.params.dashboardTileUuid,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.patch(
    '/:dashboardUuid/:dashboardTileUuid/comments/:commentId',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            res.json({
                status: 'ok',
                results: await dashboardService.resolveComment(
                    req.user!,
                    req.params.dashboardUuid,
                    req.params.commentId,
                ),
            });
        } catch (e) {
            next(e);
        }
    },
);

dashboardRouter.delete(
    '/:dashboardUuid/:dashboardTileUuid/comments/:commentId',
    allowApiKeyAuthentication,
    isAuthenticated,
    async (req, res, next) => {
        try {
            await dashboardService.deleteComment(
                req.user!,
                req.params.dashboardUuid,
                req.params.commentId,
            );
            res.json({
                status: 'ok',
                results: undefined,
            });
        } catch (e) {
            next(e);
        }
    },
);
