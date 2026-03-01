import { Router } from "express";
import asyncHandler from "express-async-handler";
import { CelestialController } from "@/entities/celestial/celestial.controller";
import {
    GalaxyRepository,
    SolarSystemRepository,
    StarRepository,
    PlanetRepository
} from "@/entities/celestial/celestial.repository";
import { CelestialService } from "@/entities/celestial/celestial.service";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

// Ensure manual composition root definition
const galaxyRepository = new GalaxyRepository();
const solarSystemRepository = new SolarSystemRepository();
const starRepository = new StarRepository();
const planetRepository = new PlanetRepository();

const service = new CelestialService(
    galaxyRepository,
    solarSystemRepository,
    starRepository,
    planetRepository
);

const controller = new CelestialController(service);

// --- GALAXY ---

router.post(
    "/galaxies",
    authenticateToken,
    asyncHandler((req, res) => controller.createGalaxy(req, res)),
);

router.get(
    "/galaxies",
    authenticateToken,
    asyncHandler((req, res) => controller.getGalaxies(req, res)),
);

router.get(
    "/galaxies/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getGalaxyById(req, res)),
);

router.patch(
    "/galaxies/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateGalaxy(req, res)),
);

router.delete(
    "/galaxies/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteGalaxy(req, res)),
);

// --- SOLAR SYSTEM ---

router.post(
    "/solar-systems",
    authenticateToken,
    asyncHandler((req, res) => controller.createSolarSystem(req, res)),
);

router.get(
    "/solar-systems",
    authenticateToken,
    asyncHandler((req, res) => controller.getSolarSystems(req, res)),
);

router.get(
    "/solar-systems/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getSolarSystemById(req, res)),
);

router.patch(
    "/solar-systems/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateSolarSystem(req, res)),
);

router.delete(
    "/solar-systems/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteSolarSystem(req, res)),
);

// --- STAR ---

router.post(
    "/stars",
    authenticateToken,
    asyncHandler((req, res) => controller.createStar(req, res)),
);

router.get(
    "/stars",
    authenticateToken,
    asyncHandler((req, res) => controller.getStars(req, res)),
);

router.get(
    "/stars/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getStarById(req, res)),
);

router.patch(
    "/stars/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updateStar(req, res)),
);

router.delete(
    "/stars/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deleteStar(req, res)),
);

// --- PLANET ---

router.post(
    "/planets",
    authenticateToken,
    asyncHandler((req, res) => controller.createPlanet(req, res)),
);

router.get(
    "/planets",
    authenticateToken,
    asyncHandler((req, res) => controller.getPlanets(req, res)),
);

router.get(
    "/planets/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.getPlanetById(req, res)),
);

router.patch(
    "/planets/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.updatePlanet(req, res)),
);

router.delete(
    "/planets/:id",
    authenticateToken,
    asyncHandler((req, res) => controller.deletePlanet(req, res)),
);

export default router;
