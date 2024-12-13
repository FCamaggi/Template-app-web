'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar si los seeds ya fueron ejecutados
    const tracker = await queryInterface.rawSelect('SeedTracker', {
      where: {
        seed_name: 'demo-data'
      }
    }, ['id']);

    if (tracker) {
      console.log('Seeds ya fueron ejecutados anteriormente');
      return;
    }

    // Crear usuario admin con contraseña conocida
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await queryInterface.bulkInsert('Users', [{
      email: 'admin@example.com',
      password: hashedPassword, // Contraseña: Admin123!
      name: 'Admin',
      role: 'admin',
      preferred_measurement: 'RM',
      experience_level: 'advanced',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Crear ejercicios base
    const exercises = await queryInterface.bulkInsert('Exercises', [
      {
        name: 'Hip Thrust',
        description: 'Ejercicio para glúteos con barra o mancuerna',
        exercise_type: 'compound',
        main_muscle_group: 'glutes',
        required_equipment: 'barbell, bench',
        measurement_type: 'both',
        is_rm_exercise: true,
        technical_instructions: 'Apoyar la espalda en el banco, colocar la barra sobre las caderas, empujar hacia arriba',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pull Down',
        description: 'Jalones en polea alta',
        exercise_type: 'compound',
        main_muscle_group: 'back',
        required_equipment: 'cable machine',
        measurement_type: 'both',
        is_rm_exercise: true,
        technical_instructions: 'Sentado, agarrar la barra y jalar hacia el pecho',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Romanian Deadlift',
        description: 'Peso muerto rumano unilateral',
        exercise_type: 'compound',
        main_muscle_group: 'hamstrings',
        required_equipment: 'dumbbell',
        measurement_type: 'both',
        is_rm_exercise: true,
        technical_instructions: 'Mantener una pierna fija, inclinar el torso hacia adelante',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Crear rutina de ejemplo (Superseries)
    const routine = await queryInterface.bulkInsert('Routines', [{
      name: 'Superseries Fullbody',
      description: 'Rutina de superseries con ejercicios consecutivos',
      creator_id: 1, // ID del admin
      type: 'full_body',
      difficulty: 'intermediate',
      estimated_time: 60,
      warmup_description: 'Movilidad articular, elongaciones 6 segundos y ejercicios dinámicos',
      is_template: true,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    // Crear entrenamientos para la rutina
    await queryInterface.bulkInsert('Trainings', [
      {
        routine_id: 1,
        exercise_id: 1, // Hip Thrust
        order: 1,
        training_type: 'strength',
        notes: 'Realizar 3 series de 10 repeticiones',
        tempo: '2-1-2-0',
        unilateral: false,
        superset_with: 2
      },
      {
        routine_id: 1,
        exercise_id: 2, // Pull Down
        order: 2,
        training_type: 'hypertrophy',
        notes: '3 series de 8 repeticiones',
        tempo: '2-1-2-0',
        unilateral: false,
        superset_with: null
      }
    ]);

    // Crear sets de ejemplo
    await queryInterface.bulkInsert('Sets', [
      {
        training_id: 1,
        order: 1,
        type: 'warmup',
        reps: '10',
        weight_type: 'direct_weight',
        weight_value: 20,
        rest_time: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        training_id: 1,
        order: 2,
        type: 'work',
        reps: '10',
        weight_type: 'RM_percentage',
        rm_percentage: 70,
        rest_time: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      }


    ]);

    await queryInterface.bulkInsert('SeedTracker', [{
      seed_name: 'demo-data',
      executed_at: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SeedTracker', { seed_name: 'demo-data' });
    await queryInterface.bulkDelete('Sets', null, {});
    await queryInterface.bulkDelete('Trainings', null, {});
    await queryInterface.bulkDelete('Routines', null, {});
    await queryInterface.bulkDelete('Exercises', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};