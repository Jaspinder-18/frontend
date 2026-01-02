// ... imports
import { getImageUrl } from '../utils/imageHelper';

// ... inside map
{
  dish.image ? (
    <img
      src={getImageUrl(dish.image)}
      alt={dish.name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
  ) : (
  <div className="w-full h-full bg-gradient-to-br from-primary-orange to-primary-red flex items-center justify-center">
    <span className="text-4xl">🍽️</span>
  </div>
)
}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-display font-bold text-white mb-1">
                        {dish.name}
                      </h3>
                      <p className="text-primary-orange font-semibold text-xl">
                        ₹{dish.price}
                      </p>
                    </div>
                  </div >
  <div className="p-6">
    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
      {dish.description}
    </p>
    <span className="inline-block px-3 py-1 bg-primary-orange/20 text-primary-orange rounded-full text-sm font-medium">
      {dish.category}
    </span>
  </div>
                </div >
              ))}
            </div >
          ) : (
  <div className="text-center py-12">
    <p className="text-gray-400">Loading popular dishes...</p>
  </div>
)}

<div className="text-center mt-12">
  <Link to="/menu" className="btn-primary">
    View Full Menu
  </Link>
</div>
        </div >
      </section >
    </div >
  );
};

export default Home;

