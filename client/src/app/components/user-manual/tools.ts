import { Items } from './sections';

export const tools: Items[] = [
    {
        name: 'Crayon',
        description:
            'Le crayon est l\'outil de base du logiciel Polydessin. Il ne sert qu\'à dessiner de simples traits, ' +
            'sans texture particulière. Il a une pointe ronde, dont l\'épaisseur est configurable (en pixels). ' +
            'Pour se servir du crayon, il faut garder le bouton gauche de la souris enfoncé en même temps qu\'on ' +
            'déplace le curseur de celle-ci sur la surface de dessin. Quand on relache le bouton, le logiciel arrête ' +
            'de dessiner. Le crayon utilse la couleur principale de l\'outil couleur, décrit plus loin dans le guide. ' +
            'Il est possible de sélectionner l\'outil Crayon avec la touche \'C\' du clavier lorsqu\'on est sur la ' +
            'vue de Dessin.'
    },
    {
        name: 'Pinceau',
        description:
            'Le pinceau fonctionne de la même manière que le crayon. Il n\'en diffère que par la texture du trait. ' +
            'Il y a le choix d\'au moins cinq textures différentes. L\'épaisseur du trait est encore une fois ' +
            'configurable en pixels. Le pinceau utilise également la couleur principale choisie avec l\'outil Couleur.' +
            ' Il est possible de sélectionner l\'outil Pinceau avec la touche \'W\' du clavier lorsqu\'on est sur la ' +
            'vue de Dessin.'
    },
    {
        name: 'Couleur',
        description:
            'L\'outil couleur permet à l\'utilisateur de sélectionner une couleur principale et une couleur ' +
            'secondaire. Ces couleurs seront combinées aux autres outils de dessin. La couleur principale est ' +
            'utilisée pour dessiner et la couleur secondaire est utilisée pour les contours lorsqu\'il y en a. ' +
            'Il est possible d\'inverser les deux couleurs et de définir la transparence pour chaque couleur. ' +
            'La sélection des couleurs se fait soit à travers une palette de couleurs qui permet de sélectionner la ' +
            'couleur, soit d\'entrer directement les valeurs en RGB ou en hexadecimal. Il est également possible de ' +
            'modifier la couleur de fond de la surface de dessin. Le système mémorise également les 10 dernières ' +
            'couleurs utilisées, et les propose à l\'utilisateur. L\'utilisateur peut choisir ces couleurs ' +
            'en tant que couleur principale ou secondaire; un clic gauche configure la couleur en tant que couleur ' +
            'principale, et un clic droit configure la couleur en tant que couleur secondaire.'
    },
    {
        name: 'Aerosol',
        description:
            'L\'aérosol est un outil qui simule un effet de peinture en aérosol. Dès que le bouton est enfoncé, un jet de peinture est' +
            'vaporisé sous le pointeur de la souris. L\'outil continu ensuite d’émettre de la peinture à intervalle' +
            'régulier jusqu’à qu’à ce que le bouton soit relâché. Il est possible pour l\'utilisateur de choisir le diametre' +
            'd\'emissions du jet de peinture ainsi que le nombre d\'emissions par seconde'
    },
    {
        name: 'Efface',
        description:
            'L\'efface est un outil qui permet de supprimer des objets de la surface de dessin. Tout objet se trouvant en contact' +
            'avec l\'efface lors d\'un clic gauche est effacé. L\'objet effacé est toujours celui « sur le dessus de la' +
            'pile » d\'objets. Pour se servir de l\'outil comme d\'une brosse, il suffit de maintenir le bouton gauche' +
            'enfoncé et de déplacer la souris. Tout objet touché pendant le mouvement sera alors supprimé.' +
            'L\'efface se trouve bien entendu centrée sur le pointeur de la souris. Elle doit être représentée par un' +
            'carré blanc de dimension configurable. C\'est lors du contact entre ce carré et un objet qu\'il y a' +
            'effacement.'
    },
    {
        name: 'Pipette',
        description:
            'Cet outil est utilisé pour saisir la couleur sous le pointeur de la souris. Un clic avec le bouton gauche' +
            'assigne la couleur saisie à la couleur principale. Un clic avec bouton droit pour l\'assigner à la couleur' +
            'secondaire. La couleur saisie est celle du pixel sous le pointeur de la souris.'

    },
    {
        name: 'Sceau de peinture',
        description:
            'L\'outil Sceau de peinture permet de remplir une certaine région de la surface de dessin. Cette zone correspond aux pixels ' +
            'voisins ayant la meme couleur, ainsi cela peut etre une forme (telle qu\'un rectangle ou une ligne) mais aussi une région ' +
            'délimitée par un trait qui formerait une boucle par exemple( ou encore le fond même sur dessin). ' +
            'Cet outil possède une tolérance (en pourcentage) qui correspond à la tolérance sur la variation entre la couleur du pixel ' +
            'sélectionné et les pixels voisins. Ainsi avec une tolérance de 0%, seuls les pixels de la bonne couleur sont acceptés, ' +
            'ajouté et forment ainsi la région. A l\'inverse, avec une tolérance de 100% toutes les couleurs sont acceptées. Il en ' +
            ' résulte donc d\'une région égale à l\'entièreté de la surface de dessin.'
    }
];
