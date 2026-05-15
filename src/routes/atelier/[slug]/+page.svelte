<script lang="ts">
	import Quiz from '$components/Quiz/Quiz.svelte';
	import MetaAnnotation from '$components/MetaAnnotation.svelte';
	import LocalMarketStats from '$components/LocalMarketStats.svelte';
	import SeoEducation from '$components/SeoEducation.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let config = $derived(data.config);

	let mainZone = $derived(config.credibility.zones[0] ?? 'votre commune');
	let heroPrefix = $derived(config.heroPrefix ?? 'à');
	let heroH1Lines = $derived.by(() => {
		const custom = config.heroH1?.trim();
		if (custom) {
			return custom
				.split('\n')
				.map((s) => s.trim())
				.filter(Boolean);
		}
		return ['Votre paysagiste', `${heroPrefix} ${mainZone}.`];
	});
	let zonesList = $derived(
		config.communes && config.communes.length > 0 ? config.communes : config.credibility.zones
	);
	let zonesTrust = $derived(zonesList.slice(0, 4));
	let communesForSeo = $derived(zonesList);

	let activeServices = $derived(config.services.filter((s) => s.active).slice(0, 5));
	let realizations = $derived(config.realizations.slice(0, 5));
	let sigMain = $derived(config.realizations[0]);
	let sigA = $derived(config.realizations[1]);
	let sigB = $derived(config.realizations[2]);
	let topTestimonials = $derived(config.testimonials.slice(0, 3));

	let foundedYear = $derived(new Date().getFullYear() - config.credibility.yearsExperience);

	let openQa = $state(0);
	let activeFilter = $state('Tout');
	let activePalTab = $state(0);

	let showRealEmail = $derived(
		Boolean(config.business.email) && config.business.email !== 'leads@jonlabs.ch'
	);

	const ATELIER_DEFAULT_HERO =
		'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=2400&q=80';

	let heroBg = $derived(
		!config.heroImage || config.heroImage.includes('/_fallback/')
			? ATELIER_DEFAULT_HERO
			: config.heroImage
	);

	const atelierQuizStyle = [
		'--color-primary: #1d2a20',
		'--color-secondary: #f6f1e4',
		'--color-accent: #b8693d',
		'--color-bg: #efe9dc',
		'--color-text: #1d2a20',
		'--color-text-muted: #7e8c72',
		"--font-body: 'Manrope', ui-sans-serif, system-ui, sans-serif",
		"--font-heading: 'Playfair Display', Georgia, serif"
	].join('; ');

	const devisFaq = [
		{
			question: 'Comment se déroule la demande de devis ?',
			answer:
				'Vous remplissez le formulaire en 2 minutes (4 étapes : type de prestation, calendrier, surface, coordonnées). Vous recevez immédiatement un chiffrage indicatif basé sur les médianes du marché romand.'
		},
		{
			question: 'Le devis est-il gratuit et sans engagement ?',
			answer:
				'Oui, entièrement gratuit. La première rencontre dure deux heures, se passe chez vous, et ne vous engage à rien.'
		},
		{
			question: 'Sous quel délai recevrai-je une offre chiffrée définitive ?',
			answer:
				'Le chiffrage indicatif est immédiat à la fin du formulaire. Le devis ferme personnalisé, après visite sur place, vous parvient sous 5 à 10 jours ouvrés.'
		}
	];

	let allFaq = $derived([...config.faq, ...devisFaq]);

	const romans = ['i.', 'ii.', 'iii.', 'iv.', 'v.'];
	const stepRomans = ['I.', 'II.', 'III.', 'IV.'];

	const galleryFilters = ['Tout', 'Création', 'Entretien', 'Aménagement', 'Détail'];

	const palTabs = [
		'Arbres et structure',
		'Arbustes',
		'Vivaces et graminées',
		'Couvre-sol',
		'Aromatiques'
	];

	const specimensByTab = [
		// 0 — Arbres & structure
		[
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Quercus_pubescens_Tuscany.jpg',
				latin: 'Quercus pubescens',
				common: 'Chêne pubescent',
				blurb:
					'Espèce indigène du coteau lémanique. Port noble, croissance lente, longévité tricentenaire. Idéal pour la trame structurelle.',
				tags: ['Indigène', 'Long terme']
			},
			{
				img: '/atelier/specimens/olea-europaea.jpg',
				latin: 'Olea europaea',
				common: 'Olivier — sujets centenaires',
				blurb:
					'Transplantations soigneusement choisies en Toscane et Provence. Acclimatation de deux saisons en pépinière avant mise en place.',
				tags: ['Persistant', 'Rusticité -12°C']
			},
			{
				img: '/atelier/specimens/cupressus-sempervirens.jpg',
				latin: 'Cupressus sempervirens',
				common: 'Cyprès florentin',
				blurb:
					"Verticale méditerranéenne. Nous privilégions les cultivars 'Stricta' pour leur port serré et leur résistance au vent du sud-ouest.",
				tags: ['Persistant', 'Méditerranéen']
			},
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Acer_campestre_in_Appennino2.jpg',
				latin: 'Acer campestre',
				common: 'Érable champêtre',
				blurb:
					'Pour les haies bocagères et les bosquets de transition. Coloration automnale dorée, supporte la taille architecturée.',
				tags: ['Indigène', 'Caduc']
			}
		],
		// 1 — Arbustes
		[
			{
				img: '/atelier/specimens/buxus-sempervirens.jpg',
				latin: 'Buxus sempervirens',
				common: 'Buis commun',
				blurb:
					'Topiaire patient. Croissance lente, taille raisonnée deux fois par an. Structure verte permanente dans les compositions formelles.',
				tags: ['Persistant', 'Topiaire']
			},
			{
				img: '/atelier/specimens/hydrangea-quercifolia.jpg',
				latin: 'Hydrangea quercifolia',
				common: 'Hortensia à feuilles de chêne',
				blurb:
					'Floraison estivale crème puis rose pâle. Tolère la mi-ombre, feuillage automnal pourpre remarquable.',
				tags: ['Caduc', 'Floraison']
			},
			{
				img: '/atelier/specimens/cornus-alba.jpg',
				latin: "Cornus alba 'Sibirica'",
				common: 'Cornouiller blanc',
				blurb:
					'Rameaux rouge vif en hiver, spectaculaires sur neige. Sol frais à humide, taille sévère tous les trois ans.',
				tags: ['Caduc', 'Hiver']
			},
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Laurustinus_%28Viburnum_tinus%29_fruits_%2815726383257%29.jpg',
				latin: 'Viburnum tinus',
				common: 'Laurier-tin',
				blurb:
					'Floraison hivernale blanche puis baies bleu métallique. Persistant méditerranéen, supporte la taille architecturée.',
				tags: ['Persistant', 'Hiver']
			}
		],
		// 2 — Vivaces & graminées
		[
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Nassella_tenuissima.jpg',
				latin: 'Stipa tenuissima',
				common: "Cheveux d'ange",
				blurb:
					'Graminée légère, mouvement perpétuel au moindre vent. Massifs secs en plein soleil, division tous les trois ans.',
				tags: ['Persistant', 'Mouvement']
			},
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Salvia_nemorosa-IMG_3624.jpg',
				latin: 'Salvia nemorosa',
				common: 'Sauge des bois',
				blurb:
					'Floraison estivale violette en épis serrés. Frugale en eau, taille après floraison pour un second épisode en septembre.',
				tags: ['Caduc', 'Estivale']
			},
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Echinacea_purpurea_Grandview_Prairie.jpg',
				latin: 'Echinacea purpurea',
				common: 'Rudbeckia pourpre',
				blurb:
					'Vivace mellifère à longue floraison. Capitules pourpres de juin à octobre. Frais en hiver pour les oiseaux.',
				tags: ['Mellifère', 'Longue']
			},
			{
				img: '/atelier/specimens/miscanthus-sinensis.jpg',
				latin: 'Miscanthus sinensis',
				common: 'Roseau de Chine',
				blurb:
					"Graminée structurelle, plumeaux argentés à l'automne. Conserve son port en hiver, taille au printemps.",
				tags: ['Caduc', 'Automne']
			}
		],
		// 3 — Couvre-sol
		[
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Pachysandra_terminalis0.jpg',
				latin: 'Pachysandra terminalis',
				common: 'Pachysandre',
				blurb:
					'Couvre-sol persistant pour zones ombragées sous arbres. Étouffe les indésirables, sans entretien après installation.',
				tags: ['Persistant', 'Ombre']
			},
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Vinca_minor_Nashville.jpg',
				latin: 'Vinca minor',
				common: 'Petite pervenche',
				blurb:
					'Tapis bleu au printemps, feuillage persistant brillant. Excellent sous-bois, supporte mi-ombre et ombre profonde.',
				tags: ['Persistant', 'Tapis']
			},
			{
				img: '/atelier/specimens/thymus-serpyllum.jpg',
				latin: 'Thymus serpyllum',
				common: 'Serpolet',
				blurb:
					'Tapis aromatique entre les pas, floraison rose mellifère. Plein soleil, sol drainant, supporte le piétinement léger.',
				tags: ['Aromatique', 'Sec']
			},
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Geranium_macrorrhizum_flowers.jpg',
				latin: 'Geranium macrorrhizum',
				common: 'Géranium vivace',
				blurb:
					'Couvre-sol parfumé, feuillage tapissant dense. Tolère la sécheresse une fois installé, floraison rose au printemps.',
				tags: ['Caduc', 'Mellifère']
			}
		],
		// 4 — Aromatiques
		[
			{
				img: '/atelier/specimens/lavandula-angustifolia.jpg',
				latin: 'Lavandula angustifolia',
				common: 'Lavande vraie',
				blurb:
					'Massifs secs, parfum estival caractéristique. Plein soleil, sol caillouteux, taille en V à la mi-août après floraison.',
				tags: ['Aromatique', 'Sec']
			},
			{
				img: '/atelier/specimens/rosmarinus-officinalis.jpg',
				latin: 'Rosmarinus officinalis',
				common: 'Romarin',
				blurb:
					'Buisson persistant méditerranéen, floraison hivernale bleu pâle. Frugal en eau, sol drainant impératif.',
				tags: ['Persistant', 'Hiver']
			},
			{
				img: '/atelier/specimens/salvia-officinalis.jpg',
				latin: 'Salvia officinalis',
				common: 'Sauge officinale',
				blurb:
					'Feuillage gris-vert aromatique. Culinaire et médicinale, taille de printemps pour conserver un port compact.',
				tags: ['Persistant', 'Culinaire']
			},
			{
				img: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Origanum_vulgare_-_harilik_pune.jpg',
				latin: 'Origanum vulgare',
				common: 'Origan',
				blurb:
					'Vivace tapissante aromatique. Floraison estivale rose mellifère, indispensable aux abeilles sauvages.',
				tags: ['Mellifère', 'Estivale']
			}
		]
	];

	const bentoSpans = [
		{ col: 5, row: 2 },
		{ col: 4, row: 1 },
		{ col: 3, row: 1 },
		{ col: 3, row: 1 },
		{ col: 4, row: 1 }
	];

	function toggleQa(i: number) {
		openQa = openQa === i ? -1 : i;
	}
</script>

<svelte:head>
	<title>{config.business.name} — Architectes paysagistes, {mainZone}</title>
	<meta
		name="description"
		content="{config.business.name} — {config.business
			.tagline}. Conception, réalisation et accompagnement de jardins privés."
	/>
	<meta name="robots" content="noindex, nofollow" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="atelier-root">
	<!-- NAV -->
	<nav class="nav">
		<div class="brand">
			{config.business.name}{#if config.business.address}<small>{config.business.address}</small
				>{/if}
		</div>
		<div class="links">
			<a href="#projets">Projets</a>
			<a href="#approche">Approche</a>
			<a href="#services">Services</a>
			<a href="#atelier">L'atelier</a>
			<a href="#contact">Contact</a>
		</div>
		<a href="#devis" class="cta">Demander un devis</a>
	</nav>

	<!-- 1. HERO -->
	<section class="hero">
		<div class="photo" style="background-image: url('{heroBg}');"></div>
		<div class="scrim"></div>

		<div class="content">
			<div class="inner">
				<div>
					<div class="meta-row">
						<span>Architectes paysagistes</span>
						<span class="sep"></span>
						<span>Depuis {foundedYear}</span>
						<span class="sep"></span>
						<span>Suisse romande</span>
					</div>
					<h1>
						{#each heroH1Lines as line, i (i)}
							{#if i === 0}{line}{:else}<br /><em>{line}</em>{/if}
						{/each}
					</h1>
					<div class="actions">
						<a href="#devis" class="btn">
							Prendre rendez-vous
							<span class="arrow"></span>
						</a>
						<a href="#projets" class="inline-link light"
							>Voir nos jardins, {foundedYear} — {new Date().getFullYear()}</a
						>
					</div>
				</div>
				<div class="side">
					{#if topTestimonials[0]}
						<div class="quote">« {topTestimonials[0].text} »</div>
						<div class="cite">— {topTestimonials[0].name}, {topTestimonials[0].location}</div>
					{:else}
						<div class="quote">
							« Un jardin n'est pas un décor. C'est un système vivant, qu'il faut écouter avant de
							dessiner. »
						</div>
						<div class="cite">— {config.business.name}</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="scroll-ind">Faire défiler</div>
	</section>

	<!-- 2. TRUST BAR -->
	<section class="trust" id="zones">
		<div class="row">
			<div class="label">Zones d'intervention et<br />références professionnelles</div>
			<div class="clients">
				{#each zonesTrust as zone, i (zone)}
					<span>{zone}</span>
					{#if i < zonesTrust.length - 1}<span class="sep"></span>{/if}
				{/each}
			</div>
			<div class="certs">
				<span class="cert-chip"
					><span class="pip"></span>{config.credibility.yearsExperience} ans</span
				>
				{#if config.credibility.chantiersCount}
					<span class="cert-chip"
						><span class="pip"></span>{config.credibility.chantiersCount}+ chantiers</span
					>
				{/if}
				{#if config.credibility.googleRating && config.credibility.googleReviewsCount}
					<span class="cert-chip"
						><span class="pip"></span>{config.credibility.googleRating.toFixed(1)}★ · {config
							.credibility.googleReviewsCount} avis</span
					>
				{/if}
			</div>
		</div>
	</section>

	<!-- 3. SERVICES -->
	<section class="services" id="services">
		<div class="section-tag"><span class="dot"></span> Section 03 · Services</div>
		<div class="wrap">
			<div class="head">
				<div>
					<span class="eyebrow"
						>{activeServices.length === 5
							? 'Cinq métiers, un atelier'
							: `${activeServices.length} métiers, un atelier`}</span
					>
					<h2>Concevoir, construire,<br /><em>entretenir le vivant.</em></h2>
				</div>
				<p class="body-l">
					De la première esquisse à la trentième année de vie d'un jardin, l'atelier accompagne ses
					clients sans rupture — la conception et la main qui plante ne se quittent jamais.
				</p>
			</div>

			<div class="grid services-grid" data-count={activeServices.length}>
				{#each activeServices as service, i (service.id)}
					<div class="service">
						<span class="service-num">{romans[i]}</span>
						<span class="nm">Pratique {i + 1}</span>
						<h3>{service.label}</h3>
						<p>{service.description}</p>
						<a class="lnk" href="#devis">En savoir plus →</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 4. SIGNATURE PROJECT -->
	{#if sigMain}
		<section class="signature" id="projets">
			<div class="section-tag over-image">
				<span class="dot"></span> Section 04 · Projet signature
			</div>
			<div class="head">
				<div>
					<span class="eyebrow">Étude de cas</span>
					<h2>{sigMain.caption},<br /><em>{mainZone}.</em></h2>
				</div>
				<div class="right">
					<p>
						Une réalisation récente menée par {config.business.name}. Conception sur mesure,
						sélection des essences adaptées au climat romand, mise en œuvre par nos équipes. Livrée
						en {new Date().getFullYear() - 1}.
					</p>
				</div>
			</div>

			<div class="sig-stage">
				<div class="sig-main" style="background-image: url('{sigMain.after}');">
					<div class="sig-caption">
						<div>
							<div class="tag">Vue principale</div>
							<div class="nm" style="margin-top:6px">{sigMain.caption}</div>
						</div>
						<div class="tag" style="text-align:right">01 / 03</div>
					</div>
				</div>
				<div class="sig-right">
					{#if sigA}
						<div class="sig-tile-a" style="background-image: url('{sigA.after}');">
							<div class="sig-caption">
								<div class="tag">{sigA.caption}</div>
								<div class="tag" style="text-align:right">02 / 03</div>
							</div>
						</div>
					{:else}
						<div class="sig-tile-a"></div>
					{/if}
					{#if sigB}
						<div class="sig-tile-b" style="background-image: url('{sigB.after}');">
							<div class="sig-caption">
								<div class="tag">{sigB.caption}</div>
								<div class="tag" style="text-align:right">03 / 03</div>
							</div>
						</div>
					{:else}
						<div class="sig-tile-b"></div>
					{/if}
				</div>
			</div>

			<div class="sig-foot">
				<div class="details">
					<div>
						<div class="dt">Zone</div>
						<div class="dd">{mainZone}</div>
					</div>
					<div>
						<div class="dt">Durée</div>
						<div class="dd">Sur mesure</div>
					</div>
					<div>
						<div class="dt">Maître d'œuvre</div>
						<div class="dd">{config.business.name}</div>
					</div>
					<div>
						<div class="dt">Achevé</div>
						<div class="dd">{new Date().getFullYear() - 1}</div>
					</div>
				</div>
				<div class="actions">
					<a class="btn" href="#devis">Discuter d'un projet similaire <span class="arrow"></span></a
					>
				</div>
			</div>
		</section>
	{/if}

	<!-- 5. PHILOSOPHY + HERBARIUM -->
	<section class="philosophy" id="approche">
		<div class="section-tag"><span class="dot"></span> Section 05 · Philosophie</div>
		<div class="grid">
			<div class="ph-eyebrow">
				<span class="eyebrow">Approche</span>
			</div>
			<h2 class="ph-title">
				Un jardin se dessine<br />en <em>trente saisons,</em><br />pas en trois plans.
			</h2>
			<div class="ph-quote">
				« Nous travaillons à l'échelle de la patience. Un platane planté en 2010 commence seulement
				à raconter quelque chose. Notre métier est d'écrire la première phrase, lisiblement. »
				<cite>— {config.business.name}, manifeste</cite>
			</div>

			<div class="ph-body">
				<p>
					Chaque jardin est conçu comme un organisme — pas comme un décor, ni comme un produit. Nous
					étudions le sol, l'orientation, le vent dominant et l'usage avant de dessiner la moindre
					ligne. La géométrie naît du site.
				</p>
				<p>
					Notre vocabulaire végétal est adapté au climat suisse : chênes, érables, oliviers
					résistants au gel, graminées de prairie, vivaces de longue saison. Nous évitons les
					plantes sous tension qui exigent des soins permanents.
				</p>

				<ul class="principles">
					<li>
						<span class="n">i.</span>
						<div>
							<b>Écouter avant de dessiner</b>
							Diagnostic pédologique, étude des vues, des microclimats, des usages familiaux. Rien n'est
							tracé avant.
						</div>
					</li>
					<li>
						<span class="n">ii.</span>
						<div>
							<b>Composer avec le temps</b>
							Le plan prévoit l'année 1, l'année 10 et l'année 30 — couches successives de végétation,
							structurelles et éphémères.
						</div>
					</li>
					<li>
						<span class="n">iii.</span>
						<div>
							<b>Bâtir pour durer</b>
							Pierres locales, bois huilés, aciers patinés. Les ouvrages se bonifient ; ils ne se remplacent
							pas.
						</div>
					</li>
				</ul>
			</div>

			<div class="herbarium">
				<div class="plate-tag">
					<span>Plate XII · Herbarium Lemanicus</span>
					<span>1923 — Atelier Archive</span>
				</div>
				<div
					class="plate"
					style="background-image: url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=80');"
				></div>
				<div class="label">
					<div>
						<div class="latin">
							Quercus pubescens<small>Chêne pubescent · spécimen de référence</small>
						</div>
					</div>
					<div class="meta">
						<div>Récolté · {mainZone}</div>
						<div>Avril {new Date().getFullYear() - 6}</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 6. PROCESS -->
	<section class="process">
		<div class="section-tag"><span class="dot"></span> Section 06 · Processus</div>
		<div class="head">
			<div>
				<span class="eyebrow">De la rencontre à la trentième saison</span>
				<h2>Un processus<br /><em>lent et précis.</em></h2>
			</div>
			<p>
				Tous nos projets suivent une chronologie identique. Aucun raccourci, aucune phase escamotée.
				Cette discipline est la condition d'un jardin qui tiendra dans le temps — et qui ne
				deviendra pas un chantier permanent.
			</p>
		</div>

		<div class="timeline">
			<div class="step">
				<div class="pn">
					<span class="roman">{stepRomans[0]}</span><span class="span">Semaines 1 — 4</span>
				</div>
				<h4>Consultation</h4>
				<p>
					Première visite sur place. Diagnostic du sol, des vues, des essences existantes.
					Conversation longue avec la famille sur les usages réels du jardin.
				</p>
				<div class="deliverables">
					<span>Carnet de visite</span>
					<span>Devis d'études</span>
				</div>
			</div>
			<div class="step">
				<div class="pn">
					<span class="roman">{stepRomans[1]}</span><span class="span">Mois 2 — 8</span>
				</div>
				<h4>Conception</h4>
				<p>
					Esquisses, plans masse, aquarelles d'ambiance, choix des essences et des matériaux. Trois
					itérations en moyenne avant validation finale.
				</p>
				<div class="deliverables">
					<span>Plans 1/200 et 1/50</span>
					<span>Échantillons matériaux</span>
					<span>Liste botanique</span>
				</div>
			</div>
			<div class="step">
				<div class="pn">
					<span class="roman">{stepRomans[2]}</span><span class="span">Mois 8 — 20</span>
				</div>
				<h4>Réalisation</h4>
				<p>
					Maîtrise d'œuvre complète, équipes {config.business.name}. Chantier piloté en direct,
					livraison saisonnière selon le calendrier horticole.
				</p>
				<div class="deliverables">
					<span>Direction de chantier</span>
					<span>Suivi hebdomadaire client</span>
				</div>
			</div>
			<div class="step">
				<div class="pn">
					<span class="roman">{stepRomans[3]}</span><span class="span">Année 1 — Année 30</span>
				</div>
				<h4>Accompagnement</h4>
				<p>
					Contrat d'entretien personnalisé. Le carnet du jardin est tenu, saison après saison. Nous
					restons les jardiniers de la maison.
				</p>
				<div class="deliverables">
					<span>Carnet annuel</span>
					<span>Visites trimestrielles</span>
					<span>Bilan décennal</span>
				</div>
			</div>
		</div>
	</section>

	<!-- 7. GALLERY -->
	{#if realizations.length > 0}
		<section class="gallery">
			<div class="section-tag"><span class="dot"></span> Section 07 · Portfolio</div>
			<div class="head">
				<div>
					<span class="eyebrow">Une sélection — {foundedYear} à {new Date().getFullYear()}</span>
					<h2>
						{config.credibility.chantiersCount ?? realizations.length} jardins,<br />une
						<em>même main.</em>
					</h2>
				</div>
				<div class="filters">
					{#each galleryFilters as f (f)}
						<button
							type="button"
							class="f"
							class:active={activeFilter === f}
							onclick={() => (activeFilter = f)}
						>
							{f}
						</button>
					{/each}
				</div>
			</div>

			<div class="bento">
				{#each realizations as r, i (r.after)}
					<div
						class="tile"
						style="grid-column: span {bentoSpans[i]?.col ?? 4}; grid-row: span {bentoSpans[i]
							?.row ?? 1};"
					>
						<div class="ph" style="background-image: url('{r.after}');"></div>
						<div class="cap">
							<div>
								<div class="nm">{r.caption}</div>
								<div class="loc">{mainZone}</div>
							</div>
							<div class="yr">{new Date().getFullYear() - Math.floor(i / 3)}</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="footer-cta">
				<div class="count">
					{realizations.length} projets présentés.
					<strong>{config.credibility.chantiersCount ?? '—'} réalisés au total.</strong>
				</div>
				<a class="btn ink" href="#devis">Discuter de votre projet <span class="arrow"></span></a>
			</div>
		</section>
	{/if}

	<!-- 8. METRICS -->
	<section class="metrics">
		<div class="section-tag"><span class="dot"></span> Section 08 · Repères</div>
		<div class="wrap metrics-wrap">
			<div class="left vrule" style="padding-left:24px">
				<span class="eyebrow">{config.credibility.yearsExperience} ans d'atelier</span>
				<h2>L'expérience<br /><em>compte ses saisons.</em></h2>
				<p>
					Quelques chiffres pour situer l'atelier — non pas comme un classement, mais comme la
					mesure d'un engagement constant pour les jardins qui nous sont confiés.
				</p>
			</div>
			<div class="metric-grid">
				<div class="mt">
					<div>
						<div class="v">{config.credibility.yearsExperience}<small>années</small></div>
					</div>
					<div class="lbl">d'atelier — depuis {foundedYear}</div>
				</div>
				<div class="mt fill">
					<div>
						<div class="v">
							{config.credibility.chantiersCount ?? (realizations.length || 15)}<sup>+</sup>
						</div>
					</div>
					<div class="lbl">projets réalisés</div>
				</div>
				<div class="mt">
					<div>
						<div class="v">{zonesList.length}</div>
					</div>
					<div class="lbl">communes desservies</div>
				</div>
				<div class="mt">
					{#if config.credibility.googleRating && config.credibility.googleReviewsCount}
						<div>
							<div class="v">
								{config.credibility.googleRating.toFixed(1)}<small
									>/ {config.credibility.googleReviewsCount} avis</small
								>
							</div>
						</div>
						<div class="lbl">note Google clients</div>
					{:else}
						<div>
							<div class="v">{config.credibility.radiusKm}<small>km</small></div>
						</div>
						<div class="lbl">rayon depuis {mainZone}</div>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- 9. TESTIMONIALS -->
	{#if topTestimonials.length > 0}
		<section class="testimonials">
			<div class="section-tag"><span class="dot"></span> Section 09 · Témoignages</div>
			<div class="head">
				<span class="eyebrow">Paroles de clients</span>
				<h2>Le jardin est <em>une conversation</em><br />qui dure des décennies.</h2>
			</div>

			<div class="test-grid">
				{#each topTestimonials as t, i (t.name + i)}
					<div class="testi" class:feature={i === 0}>
						{#if i !== 0}
							<div class="stars">{'— '.repeat(t.rating).trim()}</div>
						{/if}
						<div class="q">« {t.text} »</div>
						<div class="person">
							<div>
								<div class="nm">{t.name}</div>
								<div class="role">{t.location}</div>
							</div>
							<div class="yr">Client</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- 10. PLANT & MATERIAL PALETTE -->
	<section class="palette" id="atelier">
		<div class="section-tag"><span class="dot"></span> Section 10 · Palette</div>
		<div class="head">
			<div>
				<span class="eyebrow">Notre vocabulaire végétal</span>
				<h2>Un vocabulaire<br />adapté au <em>climat suisse.</em></h2>
			</div>
			<p>
				Nous travaillons depuis trente ans le même corpus d'essences et de matériaux, choisis pour
				leur tenue au gel, leur frugalité en eau, leur dignité en vieillissant. Voici une part de
				cette grammaire.
			</p>
		</div>

		<div class="row">
			<div class="pal-tabs">
				{#each palTabs as tab, i (tab)}
					<button
						type="button"
						class="pal-tab"
						class:active={activePalTab === i}
						onclick={() => (activePalTab = i)}
					>
						{tab}
					</button>
				{/each}
			</div>

			<div class="specimens">
				{#each specimensByTab[activePalTab] as s (s.latin)}
					<div class="spec">
						<div class="img" style="background-image: url('{s.img}');"></div>
						<div class="latin">{s.latin}<small>{s.common}</small></div>
						<div class="blurb">{s.blurb}</div>
						<div class="tags">
							{#each s.tags as tag (tag)}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 11. FAQ -->
	{#if allFaq.length > 0}
		<section class="faq">
			<div class="section-tag"><span class="dot"></span> Section 11 · Questions fréquentes</div>
			<div class="wrap faq-wrap">
				<div>
					<div class="sticky">
						<span class="eyebrow">À propos de nos projets</span>
						<h2>
							{allFaq.length} questions<br />que l'on nous pose<br /><em>souvent.</em>
						</h2>
						<p>
							La plupart des familles qui nous contactent ont les mêmes interrogations légitimes —
							délais, budget, régions desservies, fonctionnement du devis. Voici nos réponses, sans
							détour.
						</p>
						<div class="lead">
							Une question qui n'apparaît pas ici ? Nous répondons sous 48 h ouvrées.
						</div>
					</div>
				</div>
				<div>
					{#each allFaq as q, i (q.question)}
						<div class="qa" class:open={openQa === i}>
							<button type="button" class="qa-row" onclick={() => toggleQa(i)}>
								<div class="q">{q.question}</div>
								<span class="toggle">+</span>
							</button>
							<div class="a">{q.answer}</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- DEVIS (Quiz embed — id="devis" lives on the Quiz internal section) -->
	<section class="devis-wrap">
		<div class="atelier-quiz" style={atelierQuizStyle}>
			{#key config.slug}
				<Quiz {config} />
			{/key}
		</div>
	</section>

	<!-- 12. CLOSING CTA -->
	<section class="closing" id="contact">
		<div id="cta-final" aria-hidden="true"></div>
		<div class="section-tag"><span class="dot"></span> Section 12 · Prendre contact</div>
		<div class="leaf">❦</div>
		<h2>Commençons par <em>une visite.</em></h2>
		<p>La première rencontre dure deux heures, se passe chez vous, et ne vous engage à rien.</p>
		<div class="actions">
			<a class="btn terracotta" href="#devis"
				>Demander une consultation <span class="arrow"></span></a
			>
			{#if showRealEmail}
				<a class="inline-link" href="mailto:{config.business.email}"
					>ou écrire à {config.business.email}</a
				>
			{:else}
				<a class="inline-link" href="tel:{config.business.phone.replace(/\s/g, '')}"
					>ou appeler le {config.business.phone}</a
				>
			{/if}
		</div>
		<div class="small">
			Réponse sous 48 h ouvrées · {zonesTrust.join(' · ')}
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="foot">
		<div class="inner">
			<div class="brand-block">
				<div class="nm">{config.business.name}</div>
				<div class="sub">Architectes paysagistes · est. {foundedYear}</div>
				<p>
					Studio de paysage indépendant{config.business.address
						? `, basé ${config.business.address.includes(',') ? 'à ' + config.business.address.split(',').slice(-1)[0].trim() : 'à ' + mainZone}`
						: ''}. Conception, réalisation et accompagnement de jardins privés en Suisse romande
					depuis {config.credibility.yearsExperience} saisons.
				</p>
			</div>
			<div>
				<h4>Atelier</h4>
				<ul>
					<li><a href="#approche">Notre approche</a></li>
					<li><a href="#projets">Projets signature</a></li>
					<li><a href="#atelier">L'atelier</a></li>
					<li><a href="#approche">Philosophie</a></li>
				</ul>
			</div>
			<div>
				<h4>Pratiques</h4>
				<ul>
					{#each activeServices as s (s.id)}
						<li><a href="#services">{s.label}</a></li>
					{/each}
				</ul>
			</div>
			<div>
				<h4>Contact</h4>
				<address class="addr">
					{#if config.business.address}
						{config.business.address}<br /><br />
					{/if}
					{config.business.phone}<br />
					{config.business.email}
				</address>
			</div>
		</div>
		<div class="bar">
			<div>© {config.business.name} · {new Date().getFullYear()}</div>
			<div>Mentions légales · Confidentialité</div>
		</div>
	</footer>

	<MetaAnnotation anchorSelector="#zones" label="Le marché local en chiffres">
		<LocalMarketStats localMarket={config.localMarket} {mainZone} />
	</MetaAnnotation>

	<MetaAnnotation anchorSelector="#cta-final" label="Comment ça te fait monter sur Google">
		<SeoEducation communes={communesForSeo} />
	</MetaAnnotation>
</div>

<style>
	.atelier-root {
		--bone: #efe9dc;
		--bone-2: #e7e0cf;
		--paper: #f6f1e4;
		--ink: #14201a;
		--forest: #1d2a20;
		--forest-2: #243528;
		--sage: #7e8c72;
		--sage-2: #a8b29a;
		--moss: #4a5a44;
		--terracotta: #b8693d;
		--stone: #b8ad95;
		--rule: rgba(20, 32, 26, 0.16);
		--rule-soft: rgba(20, 32, 26, 0.08);

		--serif: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
		--sans: 'Manrope', ui-sans-serif, system-ui, sans-serif;
		--mono: 'DM Mono', ui-monospace, 'SF Mono', Menlo, monospace;

		--maxw: 1320px;
		--gutter: clamp(20px, 4vw, 64px);

		background: var(--bone);
		color: var(--ink);
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
		font-size: 16px;
		line-height: 1.55;
		font-weight: 400;
	}
	.atelier-root :global(*) {
		box-sizing: border-box;
	}
	.atelier-root :global(img) {
		display: block;
		max-width: 100%;
	}
	.atelier-root a {
		color: inherit;
		text-decoration: none;
	}

	.atelier-root .eyebrow {
		font-family: var(--mono);
		text-transform: uppercase;
		font-size: 11px;
		letter-spacing: 0.22em;
		color: var(--moss);
		display: inline-flex;
		align-items: center;
		gap: 10px;
	}
	.atelier-root .eyebrow::before {
		content: '';
		width: 22px;
		height: 1px;
		background: currentColor;
		opacity: 0.55;
	}
	.body-l {
		font-size: 17px;
		line-height: 1.6;
		color: #2a382f;
	}

	.vrule {
		position: relative;
	}
	.vrule::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--rule);
	}

	.wrap {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--gutter);
	}
	section {
		position: relative;
	}
	.section-tag {
		position: absolute;
		top: 28px;
		left: var(--gutter);
		display: flex;
		gap: 18px;
		align-items: center;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
		z-index: 4;
	}
	.section-tag .dot {
		width: 5px;
		height: 5px;
		background: var(--terracotta);
		border-radius: 50%;
		display: inline-block;
	}
	.section-tag.over-image {
		color: rgba(239, 233, 220, 0.85);
	}
	.section-tag.over-image .dot {
		background: var(--terracotta);
	}

	/* NAV */
	.nav {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		padding: 28px var(--gutter);
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--bone);
	}
	.nav .brand {
		display: flex;
		align-items: baseline;
		gap: 10px;
		font-family: var(--serif);
		font-size: 22px;
		letter-spacing: 0.01em;
	}
	.nav .brand small {
		font-family: var(--mono);
		text-transform: uppercase;
		font-size: 10px;
		letter-spacing: 0.22em;
		opacity: 0.7;
	}
	.nav .links {
		display: flex;
		gap: 34px;
		font-size: 13.5px;
		letter-spacing: 0.04em;
	}
	.nav .links a {
		opacity: 0.85;
		transition: opacity 0.2s;
	}
	.nav .links a:hover {
		opacity: 1;
	}
	.nav .cta {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		background: var(--bone);
		color: var(--forest);
		border: 1px solid var(--bone);
		padding: 11px 18px;
		border-radius: 999px;
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}
	.nav .cta:hover {
		background: var(--terracotta);
		color: var(--paper);
		border-color: var(--terracotta);
	}

	/* BUTTONS */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 14px;
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		padding: 16px 22px;
		border-radius: 999px;
		cursor: pointer;
		transition: all 0.25s ease;
		border: 1px solid currentColor;
		background: transparent;
		color: var(--bone);
	}
	.btn .arrow {
		width: 22px;
		height: 1px;
		background: currentColor;
		position: relative;
	}
	.btn .arrow::after {
		content: '';
		position: absolute;
		right: 0;
		top: 50%;
		width: 7px;
		height: 1px;
		background: currentColor;
		transform: translateY(-50%) rotate(40deg);
		transform-origin: right;
	}
	.btn:hover {
		background: var(--bone);
		color: var(--forest);
	}
	.btn.terracotta {
		background: var(--terracotta);
		color: var(--paper);
		border-color: var(--terracotta);
	}
	.btn.terracotta:hover {
		background: #a45a32;
		border-color: #a45a32;
	}
	.btn.ink {
		color: var(--forest);
		border-color: var(--forest);
	}
	.btn.ink:hover {
		background: var(--forest);
		color: var(--bone);
	}

	.inline-link {
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		border-bottom: 1px solid currentColor;
		padding-bottom: 3px;
		color: var(--forest);
	}
	.inline-link.light {
		color: var(--bone);
	}

	/* HERO */
	.hero {
		height: 100vh;
		min-height: 760px;
		max-height: 980px;
		position: relative;
		overflow: hidden;
		color: var(--bone);
		background: #0d160f;
	}
	.hero .photo {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		filter: saturate(0.88) brightness(0.78) contrast(1.02);
	}
	.hero .scrim {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				180deg,
				rgba(13, 22, 15, 0.55) 0%,
				rgba(13, 22, 15, 0) 28%,
				rgba(13, 22, 15, 0) 50%,
				rgba(13, 22, 15, 0.75) 100%
			),
			linear-gradient(90deg, rgba(13, 22, 15, 0.45) 0%, rgba(13, 22, 15, 0) 55%);
	}
	.hero .content {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0 var(--gutter) 72px;
	}
	.hero .inner {
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 60px;
		align-items: end;
	}
	.hero h1 {
		font-family: var(--serif);
		font-weight: 400;
		line-height: 0.95;
		font-size: clamp(58px, 8.5vw, 134px);
		margin: 0 0 30px;
		letter-spacing: -0.018em;
		text-wrap: balance;
	}
	.hero h1 em {
		font-style: italic;
		font-weight: 300;
		color: #d6c8a3;
	}
	.hero .meta-row {
		display: flex;
		gap: 28px;
		align-items: center;
		margin-bottom: 24px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(239, 233, 220, 0.78);
	}
	.hero .meta-row .sep {
		width: 28px;
		height: 1px;
		background: rgba(239, 233, 220, 0.4);
	}
	.hero .actions {
		display: flex;
		gap: 22px;
		align-items: center;
		flex-wrap: wrap;
	}
	.hero .side {
		color: rgba(239, 233, 220, 0.82);
		padding-left: 24px;
		border-left: 1px solid rgba(239, 233, 220, 0.25);
		max-width: 360px;
		align-self: end;
		padding-bottom: 8px;
	}
	.hero .side .quote {
		font-family: var(--serif);
		font-style: italic;
		font-size: 19px;
		line-height: 1.4;
		color: var(--bone);
	}
	.hero .side .cite {
		margin-top: 14px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		opacity: 0.78;
	}
	.hero .scroll-ind {
		position: absolute;
		right: var(--gutter);
		bottom: 32px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(239, 233, 220, 0.6);
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		display: flex;
		gap: 12px;
		align-items: center;
	}
	.hero .scroll-ind::after {
		content: '';
		width: 1px;
		height: 56px;
		background: rgba(239, 233, 220, 0.5);
	}

	/* TRUST */
	.trust {
		background: var(--paper);
		padding: 38px var(--gutter);
		border-top: 1px solid var(--rule-soft);
		border-bottom: 1px solid var(--rule-soft);
	}
	.trust .row {
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 220px 1fr auto;
		align-items: center;
		gap: 56px;
	}
	.trust .label {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
	}
	.trust .clients {
		display: flex;
		gap: 44px;
		align-items: center;
		flex-wrap: wrap;
		font-family: var(--serif);
		font-size: 19px;
		color: var(--forest);
		letter-spacing: 0.005em;
	}
	.trust .clients .sep {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--sage);
		display: inline-block;
	}
	.trust .certs {
		display: flex;
		gap: 18px;
		align-items: center;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--moss);
		flex-wrap: wrap;
	}
	.cert-chip {
		border: 1px solid var(--rule);
		padding: 7px 11px;
		border-radius: 4px;
		display: inline-flex;
		gap: 8px;
		align-items: center;
	}
	.cert-chip .pip {
		width: 5px;
		height: 5px;
		background: var(--moss);
		border-radius: 50%;
	}

	/* SERVICES */
	.services {
		padding: 130px 0 130px;
		background: var(--bone);
	}
	.services .head {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: 80px;
		align-items: end;
		margin-bottom: 80px;
	}
	.services h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(44px, 5vw, 78px);
		line-height: 1.02;
		margin: 18px 0 0;
		letter-spacing: -0.015em;
	}
	.services h2 em {
		font-style: italic;
		color: var(--moss);
		font-weight: 300;
	}
	.services .head p {
		max-width: 420px;
	}
	.services .grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0;
		border-top: 1px solid var(--rule);
	}
	.services .grid[data-count='4'] {
		grid-template-columns: repeat(4, 1fr);
	}
	.services .grid[data-count='3'] {
		grid-template-columns: repeat(3, 1fr);
	}
	.services .grid[data-count='2'] {
		grid-template-columns: repeat(2, 1fr);
	}
	.service {
		padding: 36px 28px 40px 0;
		border-right: 1px solid var(--rule);
		position: relative;
		min-height: 360px;
		display: flex;
		flex-direction: column;
	}
	.service:last-child {
		border-right: 0;
		padding-right: 0;
	}
	.service:not(:first-child) {
		padding-left: 28px;
	}
	.service .nm {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
	}
	.service h3 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: 30px;
		line-height: 1.1;
		margin: 18px 0 14px;
		letter-spacing: -0.01em;
	}
	.service p {
		font-size: 14.5px;
		line-height: 1.55;
		color: #3b4a3f;
		margin: 0 0 24px;
	}
	.service .lnk {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--forest);
		border-bottom: 1px solid var(--forest);
		padding-bottom: 3px;
		align-self: flex-start;
		margin-bottom: 22px;
		margin-top: auto;
	}
	.service-num {
		position: absolute;
		top: 0;
		right: 0;
		font-family: var(--serif);
		font-style: italic;
		font-size: 22px;
		color: var(--sage);
	}

	/* SIGNATURE */
	.signature {
		background: var(--forest);
		color: var(--bone);
		padding: 120px 0 130px;
		position: relative;
	}
	.signature .head {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		margin-bottom: 70px;
		align-items: end;
	}
	.signature .eyebrow {
		color: var(--sage-2);
	}
	.signature h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(48px, 6vw, 92px);
		line-height: 1;
		margin: 16px 0 0;
		letter-spacing: -0.018em;
	}
	.signature h2 em {
		font-style: italic;
		color: #c4b890;
		font-weight: 300;
	}
	.signature .head .right {
		padding-bottom: 14px;
	}
	.signature .head .right p {
		color: #d3cdb9;
		font-size: 16.5px;
		line-height: 1.6;
		max-width: 440px;
	}
	.sig-stage {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 28px;
		position: relative;
	}
	.sig-main {
		position: relative;
		height: 640px;
		overflow: hidden;
		border-radius: 2px;
		background-size: cover;
		background-position: center;
		filter: saturate(0.92) contrast(1.02);
	}
	.sig-right {
		display: grid;
		grid-template-rows: 0.45fr 0.55fr;
		gap: 28px;
	}
	.sig-tile-a,
	.sig-tile-b {
		position: relative;
		overflow: hidden;
		border-radius: 2px;
		background-size: cover;
		background-position: center;
		filter: saturate(0.9) contrast(1.02);
	}
	.sig-main::after,
	.sig-tile-a::after,
	.sig-tile-b::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(13, 22, 15, 0) 40%, rgba(13, 22, 15, 0.82) 100%);
		pointer-events: none;
		z-index: 1;
	}
	.sig-caption {
		position: absolute;
		left: 22px;
		bottom: 22px;
		right: 22px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		color: var(--bone);
		z-index: 2;
	}
	.sig-caption .tag {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		opacity: 0.85;
	}
	.sig-caption .nm {
		font-family: var(--serif);
		font-style: italic;
		font-size: 22px;
	}
	.sig-foot {
		max-width: var(--maxw);
		margin: 40px auto 0;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 28px;
	}
	.sig-foot .details {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 30px;
		border-top: 1px solid rgba(239, 233, 220, 0.18);
		padding-top: 24px;
	}
	.sig-foot .dt {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--sage-2);
		margin-bottom: 8px;
	}
	.sig-foot .dd {
		font-family: var(--serif);
		font-size: 19px;
		color: var(--bone);
	}
	.sig-foot .actions {
		border-top: 1px solid rgba(239, 233, 220, 0.18);
		padding-top: 24px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	/* PHILOSOPHY */
	.philosophy {
		background: var(--bone);
		padding: 140px 0 150px;
		position: relative;
		overflow: hidden;
	}
	.philosophy .grid {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 28px;
		position: relative;
	}
	.ph-eyebrow {
		grid-column: 1 / span 3;
		padding-top: 8px;
	}
	.ph-title {
		grid-column: 1 / span 7;
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(48px, 6vw, 96px);
		line-height: 0.98;
		letter-spacing: -0.018em;
		margin: 0;
	}
	.ph-title em {
		font-style: italic;
		color: var(--moss);
		font-weight: 300;
	}
	.ph-quote {
		grid-column: 8 / span 5;
		align-self: end;
		font-family: var(--serif);
		font-style: italic;
		font-size: 23px;
		line-height: 1.4;
		color: var(--forest);
		padding-left: 24px;
		border-left: 1px solid var(--rule);
	}
	.ph-quote cite {
		display: block;
		margin-top: 18px;
		font-style: normal;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
	}
	.ph-body {
		grid-column: 1 / span 5;
		margin-top: 80px;
	}
	.ph-body p {
		font-size: 16px;
		line-height: 1.7;
		color: #2a382f;
		margin: 0 0 22px;
		max-width: 460px;
	}
	.ph-body .principles {
		margin-top: 36px;
		display: grid;
		gap: 18px;
		padding-top: 22px;
		border-top: 1px solid var(--rule);
		list-style: none;
		padding-left: 0;
	}
	.ph-body .principles li {
		display: grid;
		grid-template-columns: 30px 1fr;
		gap: 18px;
		font-size: 14.5px;
		color: #2a382f;
	}
	.ph-body .principles li .n {
		font-family: var(--serif);
		font-style: italic;
		color: var(--terracotta);
		font-size: 16px;
	}
	.ph-body .principles li b {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 18px;
		color: var(--forest);
		display: block;
		margin-bottom: 4px;
		letter-spacing: -0.005em;
	}

	.herbarium {
		grid-column: 7 / span 6;
		margin-top: 60px;
		position: relative;
		background: var(--paper);
		border: 1px solid var(--rule);
		padding: 36px 36px 30px;
		min-height: 580px;
	}
	.herbarium .plate-tag {
		position: absolute;
		top: 22px;
		left: 36px;
		right: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
	}
	.herbarium .plate {
		position: relative;
		height: 420px;
		margin-top: 36px;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		filter: saturate(0.75) sepia(0.18) contrast(1.05) brightness(0.98);
		mix-blend-mode: multiply;
	}
	.herbarium .label {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 20px;
		padding-top: 22px;
		border-top: 1px solid var(--rule);
	}
	.herbarium .label .latin {
		font-family: var(--serif);
		font-style: italic;
		font-size: 24px;
		color: var(--forest);
	}
	.herbarium .label .latin small {
		display: block;
		font-style: normal;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
		margin-top: 4px;
	}
	.herbarium .label .meta {
		text-align: right;
		color: var(--moss);
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	/* PROCESS */
	.process {
		background: var(--paper);
		padding: 130px 0 140px;
		position: relative;
	}
	.process .head {
		max-width: var(--maxw);
		margin: 0 auto 80px;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 80px;
		align-items: end;
	}
	.process h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(44px, 5vw, 76px);
		line-height: 1.02;
		margin: 18px 0 0;
		letter-spacing: -0.015em;
	}
	.process h2 em {
		font-style: italic;
		color: var(--moss);
		font-weight: 300;
	}
	.process .head p {
		font-size: 16.5px;
		line-height: 1.6;
		max-width: 520px;
		color: #2a382f;
	}
	.timeline {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0;
		border-top: 1px solid var(--rule);
	}
	.step {
		padding: 30px 26px 30px 0;
		border-right: 1px solid var(--rule);
		position: relative;
		min-height: 320px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.step:last-child {
		border-right: 0;
		padding-right: 0;
	}
	.step:not(:first-child) {
		padding-left: 26px;
	}
	.step .pn {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.step .pn .roman {
		font-family: var(--serif);
		font-style: italic;
		font-size: 30px;
		color: var(--terracotta);
		font-weight: 300;
	}
	.step .pn .span {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--moss);
	}
	.step h4 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: 26px;
		margin: 6px 0 0;
		letter-spacing: -0.005em;
	}
	.step p {
		font-size: 14.5px;
		line-height: 1.6;
		color: #3b4a3f;
		margin: 0;
		max-width: 280px;
	}
	.step .deliverables {
		margin-top: auto;
		padding-top: 18px;
		border-top: 1px solid var(--rule-soft);
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.step .deliverables span {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--moss);
	}
	.step .deliverables span::before {
		content: '○  ';
		color: var(--sage);
	}

	/* GALLERY */
	.gallery {
		background: var(--bone);
		padding: 120px 0 0;
	}
	.gallery .head {
		max-width: var(--maxw);
		margin: 0 auto 60px;
		padding: 0 var(--gutter);
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 40px;
		flex-wrap: wrap;
	}
	.gallery h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(40px, 4.4vw, 64px);
		line-height: 1;
		margin: 14px 0 0;
		letter-spacing: -0.015em;
	}
	.gallery h2 em {
		font-style: italic;
		color: var(--moss);
	}
	.filters {
		display: flex;
		gap: 26px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--moss);
		align-items: center;
		flex-wrap: wrap;
	}
	.filters .f {
		cursor: pointer;
		padding-bottom: 4px;
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
	}
	.filters .f.active {
		color: var(--forest);
		border-bottom: 1px solid var(--forest);
	}
	.bento {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-auto-rows: 220px;
		gap: 0;
		width: 100%;
	}
	.tile {
		position: relative;
		overflow: hidden;
		background: #2a382f;
		cursor: pointer;
	}
	.tile .ph {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		filter: saturate(0.9) contrast(1.02) brightness(0.96);
		transition: transform 0.9s ease;
	}
	.tile:hover .ph {
		transform: scale(1.04);
	}
	.tile .cap {
		position: absolute;
		left: 22px;
		bottom: 22px;
		right: 22px;
		color: var(--bone);
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 20px;
		opacity: 1;
		transition: transform 0.35s ease;
		z-index: 2;
	}
	.tile:hover .cap {
		transform: translateY(-2px);
	}
	.tile .cap .nm {
		font-family: var(--serif);
		font-style: italic;
		font-size: 22px;
		line-height: 1.1;
		text-shadow: 0 1px 16px rgba(0, 0, 0, 0.35);
	}
	.tile .cap .loc,
	.tile .cap .yr {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		opacity: 0.92;
	}
	.tile::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(13, 22, 15, 0) 30%, rgba(13, 22, 15, 0.85) 100%);
		opacity: 1;
		transition: opacity 0.35s ease;
		z-index: 1;
	}
	.tile:hover::after {
		opacity: 1;
	}
	.gallery .footer-cta {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 56px var(--gutter) 120px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 30px;
		border-bottom: 1px solid var(--rule);
		flex-wrap: wrap;
	}
	.gallery .footer-cta .count {
		font-family: var(--serif);
		font-style: italic;
		font-size: 24px;
		color: var(--moss);
	}
	.gallery .footer-cta .count strong {
		font-style: normal;
		font-weight: 400;
		color: var(--forest);
	}

	/* METRICS */
	.metrics {
		background: var(--bone);
		padding: 110px 0;
		position: relative;
	}
	.metrics-wrap {
		display: grid;
		grid-template-columns: 0.95fr 1.2fr;
		gap: 80px;
		align-items: center;
	}
	.metrics .left .eyebrow {
		margin-bottom: 22px;
	}
	.metrics .left h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(36px, 3.8vw, 56px);
		line-height: 1.05;
		margin: 0 0 24px;
		letter-spacing: -0.012em;
	}
	.metrics .left h2 em {
		font-style: italic;
		color: var(--moss);
	}
	.metrics .left p {
		color: #2a382f;
		max-width: 440px;
		font-size: 16px;
		line-height: 1.6;
	}
	.metric-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0;
		border-top: 1px solid var(--rule);
		border-left: 1px solid var(--rule);
	}
	.mt {
		padding: 36px 32px;
		border-right: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		position: relative;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.mt .v {
		font-family: var(--serif);
		font-weight: 300;
		font-size: 86px;
		line-height: 1;
		letter-spacing: -0.025em;
		color: var(--forest);
	}
	.mt .v sup {
		font-size: 28px;
		vertical-align: top;
		margin-left: 4px;
		color: var(--terracotta);
		font-style: italic;
	}
	.mt .v small {
		font-family: var(--mono);
		font-size: 14px;
		color: var(--moss);
		margin-left: 6px;
		letter-spacing: 0.06em;
	}
	.mt .lbl {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
		margin-top: 12px;
	}
	.mt.fill {
		background: var(--forest);
		color: var(--bone);
	}
	.mt.fill .v {
		color: var(--bone);
	}
	.mt.fill .v sup {
		color: #d3c08a;
	}
	.mt.fill .lbl {
		color: rgba(239, 233, 220, 0.7);
	}

	/* TESTIMONIALS */
	.testimonials {
		background: var(--paper);
		padding: 130px 0 140px;
		position: relative;
	}
	.testimonials .head {
		max-width: var(--maxw);
		margin: 0 auto 70px;
		padding: 0 var(--gutter);
	}
	.testimonials h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(44px, 5vw, 72px);
		line-height: 1.02;
		letter-spacing: -0.015em;
		margin: 18px 0 0;
		max-width: 880px;
	}
	.testimonials h2 em {
		font-style: italic;
		color: var(--moss);
	}
	.test-grid {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1.2fr 1fr 1fr;
		gap: 28px;
		align-items: stretch;
	}
	.testi {
		background: var(--bone);
		border: 1px solid var(--rule-soft);
		padding: 36px 32px 30px;
		display: flex;
		flex-direction: column;
		gap: 28px;
		position: relative;
	}
	.testi.feature {
		background: var(--forest);
		color: var(--bone);
		border-color: var(--forest);
	}
	.testi .q {
		font-family: var(--serif);
		font-size: 26px;
		line-height: 1.32;
		letter-spacing: -0.003em;
		color: var(--forest);
		font-weight: 400;
	}
	.testi.feature .q {
		color: var(--bone);
		font-size: 30px;
		line-height: 1.3;
	}
	.testi .person {
		margin-top: auto;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		padding-top: 22px;
		border-top: 1px solid var(--rule-soft);
	}
	.testi.feature .person {
		border-color: rgba(239, 233, 220, 0.2);
	}
	.testi .person .nm {
		font-family: var(--serif);
		font-style: italic;
		font-size: 18px;
	}
	.testi .person .role {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--moss);
		margin-top: 4px;
	}
	.testi.feature .person .role {
		color: var(--sage-2);
	}
	.testi .person .yr {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--moss);
	}
	.testi.feature .person .yr {
		color: var(--sage-2);
	}
	.testi .stars {
		font-family: var(--serif);
		font-style: italic;
		color: var(--terracotta);
		font-size: 14px;
		letter-spacing: 0.3em;
	}

	/* PALETTE */
	.palette {
		background: var(--bone);
		padding: 130px 0 140px;
	}
	.palette .head {
		max-width: var(--maxw);
		margin: 0 auto 60px;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: end;
	}
	.palette h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(40px, 4.4vw, 66px);
		line-height: 1.02;
		letter-spacing: -0.015em;
		margin: 18px 0 0;
	}
	.palette h2 em {
		font-style: italic;
		color: var(--moss);
	}
	.palette .head p {
		color: #2a382f;
		font-size: 16px;
		line-height: 1.6;
		max-width: 480px;
	}
	.palette .row {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--gutter);
	}
	.pal-tabs {
		display: flex;
		gap: 0;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		margin-bottom: 50px;
	}
	.pal-tab {
		flex: 1;
		padding: 22px 0;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
		border-right: 1px solid var(--rule);
		text-align: center;
		transition:
			background 0.2s,
			color 0.2s;
		background: none;
		border-top: none;
		border-bottom: none;
		border-left: none;
	}
	.pal-tab:last-child {
		border-right: 0;
	}
	.pal-tab.active {
		background: var(--forest);
		color: var(--bone);
	}
	.specimens {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 28px;
	}
	.spec {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.spec .img {
		aspect-ratio: 4 / 5;
		background-size: cover;
		background-position: center;
		filter: saturate(0.85) contrast(1.02);
	}
	.spec .latin {
		font-family: var(--serif);
		font-style: italic;
		font-size: 22px;
		color: var(--forest);
	}
	.spec .latin small {
		display: block;
		font-style: normal;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
		margin-top: 4px;
	}
	.spec .blurb {
		font-size: 13.5px;
		color: #3b4a3f;
		line-height: 1.55;
		margin-top: 2px;
	}
	.spec .tags {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 4px;
	}
	.spec .tag {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--moss);
		border: 1px solid var(--rule);
		padding: 4px 8px;
		border-radius: 2px;
	}
	/* FAQ */
	.faq {
		background: var(--paper);
		padding: 130px 0 140px;
	}
	.faq-wrap {
		display: grid;
		grid-template-columns: 0.9fr 1.4fr;
		gap: 80px;
		align-items: start;
	}
	.faq h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(40px, 4.4vw, 66px);
		line-height: 1.02;
		margin: 18px 0 24px;
		letter-spacing: -0.015em;
	}
	.faq h2 em {
		font-style: italic;
		color: var(--moss);
	}
	.faq .sticky {
		position: sticky;
		top: 36px;
	}
	.faq .sticky p {
		color: #2a382f;
		font-size: 15.5px;
		line-height: 1.6;
		max-width: 380px;
	}
	.faq .sticky .lead {
		font-family: var(--serif);
		font-style: italic;
		font-size: 19px;
		color: var(--moss);
		margin-top: 32px;
		padding-top: 32px;
		border-top: 1px solid var(--rule);
		max-width: 380px;
	}
	.qa {
		border-top: 1px solid var(--rule);
		padding: 26px 0 26px;
		cursor: pointer;
	}
	.qa:last-of-type {
		border-bottom: 1px solid var(--rule);
	}
	.qa-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 30px;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		cursor: pointer;
		color: inherit;
		font: inherit;
	}
	.qa .q {
		font-family: var(--serif);
		font-size: 26px;
		line-height: 1.25;
		color: var(--forest);
		letter-spacing: -0.005em;
		flex: 1;
	}
	.qa .toggle {
		font-family: var(--serif);
		font-style: italic;
		font-size: 24px;
		color: var(--terracotta);
		flex-shrink: 0;
		padding-top: 2px;
		transition: transform 0.25s;
	}
	.qa.open .toggle {
		transform: rotate(45deg);
	}
	.qa .a {
		max-height: 0;
		overflow: hidden;
		transition:
			max-height 0.35s ease,
			margin 0.25s ease,
			opacity 0.3s ease;
		opacity: 0;
		margin-top: 0;
		font-size: 15.5px;
		line-height: 1.65;
		color: #3b4a3f;
		max-width: 720px;
	}
	.qa.open .a {
		max-height: 600px;
		opacity: 1;
		margin-top: 18px;
	}

	/* DEVIS */
	.devis-wrap {
		background: var(--paper);
		padding: 80px 0 100px;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}
	.atelier-quiz {
		font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
	}
	.atelier-quiz :global(h1),
	.atelier-quiz :global(h2),
	.atelier-quiz :global(h3) {
		font-family: 'Playfair Display', Georgia, serif;
		letter-spacing: -0.01em;
		font-weight: 400;
	}
	.atelier-quiz :global(button),
	.atelier-quiz :global(input),
	.atelier-quiz :global(textarea),
	.atelier-quiz :global(label),
	.atelier-quiz :global(p),
	.atelier-quiz :global(span),
	.atelier-quiz :global(li) {
		font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
	}

	/* Palette specimen entry transition on tab switch */
	.spec {
		animation: spec-in 0.35s ease both;
	}
	@keyframes spec-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* CLOSING */
	.closing {
		background: var(--bone);
		padding: 160px 0 130px;
		text-align: center;
		position: relative;
	}
	.closing .leaf {
		position: absolute;
		left: 50%;
		top: 110px;
		transform: translateX(-50%);
		font-family: var(--serif);
		font-style: italic;
		color: var(--terracotta);
		font-size: 18px;
	}
	.closing h2 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(56px, 7vw, 120px);
		line-height: 0.98;
		letter-spacing: -0.02em;
		margin: 30px auto 0;
		max-width: 1100px;
	}
	.closing h2 em {
		font-style: italic;
		color: var(--moss);
		font-weight: 300;
	}
	.closing p {
		font-family: var(--serif);
		font-style: italic;
		font-size: 22px;
		color: var(--moss);
		margin: 36px auto 50px;
		max-width: 540px;
	}
	.closing .actions {
		display: inline-flex;
		gap: 22px;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
	}
	.closing .small {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--moss);
		margin-top: 70px;
	}

	/* FOOTER */
	.foot {
		background: var(--forest);
		color: var(--bone);
		padding: 80px var(--gutter) 36px;
	}
	.foot .inner {
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 1fr;
		gap: 60px;
	}
	.foot h4 {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--sage-2);
		margin: 0 0 22px;
		font-weight: 400;
	}
	.foot .brand-block .nm {
		font-family: var(--serif);
		font-size: 36px;
		letter-spacing: 0.005em;
		margin-bottom: 8px;
	}
	.foot .brand-block .sub {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--sage-2);
		margin-bottom: 28px;
	}
	.foot .brand-block p {
		color: #d3cdb9;
		font-size: 14.5px;
		line-height: 1.65;
		max-width: 360px;
	}
	.foot ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 10px;
	}
	.foot ul a {
		font-size: 14.5px;
		color: var(--bone);
		opacity: 0.85;
	}
	.foot ul a:hover {
		opacity: 1;
	}
	.foot .addr {
		font-style: normal;
		font-size: 14.5px;
		line-height: 1.7;
		color: #d3cdb9;
	}
	.foot .bar {
		max-width: var(--maxw);
		margin: 80px auto 0;
		padding-top: 24px;
		border-top: 1px solid rgba(239, 233, 220, 0.18);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--sage-2);
		flex-wrap: wrap;
		gap: 14px;
	}

	@media (max-width: 980px) {
		.nav .links {
			display: none;
		}
		.hero .inner {
			grid-template-columns: 1fr;
			gap: 30px;
		}
		.services .grid,
		.services .grid[data-count='4'],
		.services .grid[data-count='3'],
		.services .grid[data-count='2'],
		.timeline,
		.specimens {
			grid-template-columns: 1fr 1fr;
		}
		.service,
		.step {
			border-right: 0;
			border-bottom: 1px solid var(--rule);
		}
		.sig-stage,
		.sig-foot,
		.signature .head,
		.process .head,
		.gallery .head,
		.palette .head,
		.faq-wrap,
		.metrics-wrap,
		.test-grid {
			grid-template-columns: 1fr;
			gap: 30px;
		}
		.bento {
			grid-template-columns: repeat(6, 1fr);
			grid-auto-rows: 180px;
		}
		.bento .tile {
			grid-column: span 6 !important;
			grid-row: span 1 !important;
		}
		.philosophy .grid {
			grid-template-columns: 1fr;
		}
		.ph-title,
		.ph-quote,
		.ph-body,
		.herbarium,
		.ph-eyebrow {
			grid-column: 1 / -1;
		}
		.foot .inner {
			grid-template-columns: 1fr 1fr;
		}
		.trust .row {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}
</style>
